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
    app.get("/getadmin/:email", async (req, res) => {
      const userEmail = req.params.email;
      const user = await usersCollection.findOne({ email: userEmail });
      if (user) {
        if (user.role === "admin") {
          res.send({ admin: true });
        }
      } else {
        res.send({ admin: false });
      }
    });
    app.get("/makeadmin/:email", async (req, res) => {
      const email = req.params.email;
      const finduser = await usersCollection.findOne({ email });
      const options = { upsert: true };
      // create a document that sets the plot of the movie
      const updateDoc = {
        $set: {
          role: "admin",
        },
      };
      if (finduser) {
        const updateUser = await usersCollection.updateOne(
          { email },
          updateDoc,
          options
        );
        res.send(updateUser);
      } else {
        res.status(404);
      }
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
