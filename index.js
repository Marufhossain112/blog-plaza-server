const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
// middleware
app.use(cors());
app.use(express.json());
// port
const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("I am running on the home of the Server.");
});

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@cluster0.efpjwcu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
console.log(client, "Database connected");

async function run() {
  try {
    const addBlogCollections = client
      .db("addBlogDatabase")
      .collection("addBlogCollection");
    // create blog data
    app.post("/addBlog", async (req, res) => {
      const user = req.body;
      const result = await addBlogCollections.insertOne(user);
      res.send(result);
      console.log(result);
    });
    // get blog data
    app.get("/addBlog", async (req, res) => {
      const query = {};
      const cursor = await addBlogCollections.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
