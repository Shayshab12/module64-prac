const express = require("express");
var cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
app.use(cors());

const port = process.env.PORT || 5000;
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r3udp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run(req, res) {
  try {
    await client.connect();
    // console.log("data connected");
    const database = client.db("insertDB");
    const users = database.collection("users");
    // get api
    app.get("/users", async (req, res) => {
      const cursor = users.find({});
      const sampleUsers = await cursor.toArray();
      res.send(sampleUsers);
    });
    // post api
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await users.insertOne(newUser);
      console.log("Got a user", req.body);
      console.log("Got a user", result);
      res.json(newUser);
    });
    //del operation
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await users.deleteOne(query);
      console.log("Del user", id);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
