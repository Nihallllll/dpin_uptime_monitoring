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
           CALLBACKS[data.data.callbackId](data);
           delete CALLBACKS[data.data.callbackId];
        }
      }
    }
  });