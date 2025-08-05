import  Express  from "express";
import { prismaClient } from "db/clients";
import cors from "cors";

const app = Express();
app.use(cors());
app.use(Express.json());

app.post("/api/v1/website", async (req, res) => {
    const userId = req.userId!;
    const {url} = req.body;
   const data = await prismaClient.website.create({
        data: {
            url,
            userId
        }
    });

    res.json({
        id : data.id
    });
});

app.get("/api/v1/website/status", async (req, res) => {
    const websiteId = req.query.websiteId;
    const userId = req.userId;
    const data = await prismaClient.website.findFirst({
        where: {
            id: websiteId?.toString(),
            userId,
            disabled : false
        },
        include: {
            ticks: true
        }
    });
    res.json(data);
});

app.get("/api/v1/websites", async (req, res) => {
    const userId = req.userId!;
    const data = await prismaClient.website.findMany({
        where: {
            userId,
            disabled : false
        },
        include: {
            ticks: true
        }
    });
    res.json(data);
});



app.delete("/api/v1/website", async (req, res) => {
    const websiteId = req.query.websiteId;
    const userId = req.userId;
    const data = await prismaClient.website.update({
        where: {
            id: websiteId?.toString(),
            userId
        },
        data :{
            disabled : true
        }
    });
    res.json("Website removed successfully");
});


app.listen(3000);