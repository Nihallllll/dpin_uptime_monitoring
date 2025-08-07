import { randomUUIDv7, type ServerWebSocket } from "bun";
import type { IncomingMessage, SignupIncomingMessage } from "common/types";
import { prismaClient } from "db/clients";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";

const availableValidators: { validatorId: string, socket: ServerWebSocket<unknown>, publicKey: string }[] = [];

const CALLBACKS : { [callbackId: string]: (data: IncomingMessage) => void } = {}
const COST_PER_VALIDATION = 100; // in lamports

 Bun.serve({
    fetch(req, server) {
      if (server.upgrade(req)) {
        return;
      }
      return new Response("Upgrade failed", { status: 500 });
    },
    port: 8081,
    websocket: {
      async message(ws :ServerWebSocket<unknown>, message: string) {
        const data =JSON.parse(message);
        if(data.type === 'signup') {
           const verified = await verifyMessage(
            `Signup message from ${data.data.callbackId} ${data.data.publicKey}`,
            data.data.publicKey,
            data.data.signedMessage
          );
          if(!verified) {
            return;
          }
        } else if(data.type === 'validate') {
           CALLBACKS[data.data.callbackId]?(data.data);
           delete CALLBACKS[data.data.callbackId];
        }
      }
    }
  });


  export async function verifyMessage(message: string, publicKey: string, signedMessage: string) {
    const messageBytes = nacl_util.decodeUTF8(message);
    const result = nacl.sign.detached.verify(
        messageBytes,
        new Uint8Array(JSON.parse(signedMessage)),
        new PublicKey(publicKey).toBytes(),
    );
    return result;
  }
    

  async function signupHandler(ws: ServerWebSocket<unknown>, { ip, publicKey, signedMessage, callbackId }: SignupIncomingMessage) {
    const validatorDb = await prismaClient.validator.findFirst({
        where: {
            publicKey,
        },
    });
    

    if(validatorDb){
        ws.send(JSON.stringify({
            type: 'signup',
            data: {
                validatorId: validatorDb.id,
                callbackId,
            }
        }));

        availableValidators.push({
            validatorId: validatorDb.id,
            socket: ws,
            publicKey: validatorDb.publicKey,
        });
        
    }



    const validator = await prismaClient.validator.create({
        data: {
            publicKey,
            ip,
            location : "unknown",
        },
    });
    ws.send(JSON.stringify({
        type: 'signup',
        data: {
            validatorId: validator.id,
            callbackId,
        }
    }));

    availableValidators.push({
        validatorId: validator.id,
        socket: ws,
        publicKey: validator.publicKey,
    });

}

setInterval(async () => {
    const websitesToMonitor = await prismaClient.website.findMany({
        where: {
            disabled: false,
        }
    });

    for(const website of websitesToMonitor) {
        availableValidators.forEach(async (validator) => {
            const callbackId = randomUUIDv7();
            validator.socket.send(JSON.stringify({
                type: 'validate',
                data: {
                    url: website.url,
                    callbackId,
                    websiteId: website.id,
                }
            }));
            CALLBACKS[callbackId] = (data : IncomingMessage) => {
                if(data.type === 'validate') {
                    const { status, latency, websiteId, validatorId } = data.data;
                    const verfied = await verifyMessage(
                        `Validate message from ${validatorId}`,
                        validator.publicKey,
                        data.data.signedMessage
                    );
                    if(!verfied) {
                        return;
                    }

                    await prismaClient.$transaction(async (tx:any) => {
                        await tx.websiteTick.create({
                            data: {
                                websiteId: website.id,
                                validatorId,
                                status,
                                latency,
                                createdAt: new Date(),
                            },
                        });

                        await tx.validator.update({
                            where: { id: validatorId },
                            data: {
                                pendingPayouts: { increment: COST_PER_VALIDATION },
                            },
                        });
                    });
                }
} , 60*1000);
