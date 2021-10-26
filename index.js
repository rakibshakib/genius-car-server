const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

// mongoSetting 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tygmv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const GeniusCar = client.db("GeniusCar");
        const servicesData = GeniusCar.collection("services");
        // GET API 
        app.get("/services", async(req, res)=> {
            const cursor = servicesData.find({})
            const services = await cursor.toArray();
            res.send(services)
        })

        // POST API 
        app.post("/services", async(req, res)=>{
            const service = req.body;
            // console.log(service);
            console.log("hitted the post api.");
            const result = await servicesData.insertOne(service)
            res.json(result)
            // res.send("database hitted...")
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Server is Running.....")
});

app.listen(port, () => {
    console.log("Nodemon is running for genius server....");
})