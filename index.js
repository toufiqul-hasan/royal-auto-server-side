const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster.es8at.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const carCollection = client.db("RoyalAuto").collection("car");

    app.get("/car", async (req, res) => {
      const query = {};
      const cursor = carCollection.find(query);
      const car = await cursor.toArray();
      res.send(car);
    });

    app.get("/car/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const car = await carCollection.findOne(query);
      res.send(car);
    });

    app.post("/car", async (req, res) => {
      const newCar = req.body;
      const result = await carCollection.insertOne(newCar);
      res.send(result);
    });

    app.put("/car/:id", async (req, res) => {
      const id = req.params.id;
      const brandNewQuantity = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: { quantity: brandNewQuantity.newQuantity },
      };
      const result = await carCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    });

    app.delete("/car/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Royal Auto Server Running");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});