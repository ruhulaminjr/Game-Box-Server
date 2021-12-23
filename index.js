const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bdjvz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const userDb = client.db("gamebox");
    const usersCollection = userDb.collection("users");
    app.post("/saveusers", async (req, res) => {
      const user = req.body;
      const savetodb = await usersCollection.insertOne(user);
      res.send(savetodb);
    });
  } finally {
  }
}

run().catch((error) => console.log(error));
app.get("/", (req, res) => {
  res.send("Server Running Succesfully");
});
app.listen(port, () => {
  console.log(`Server Running On http://localhost:${port}/`);
});
