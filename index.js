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

const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
  CURSOR_FLAGS,
} = require("mongodb");
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
    const publishedBlogsCollections = client
      .db("addBlogDatabase")
      .collection("publishedBlogCollection");
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
    // get specific data
    app.get("/blogDetails/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await addBlogCollections.findOne(query);
      res.send(result);
    });
    // update specific data
    app.put("/updateBlog/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const blog = req.body;
      const option = { upsert: true };
      const updatedBlog = {
        $set: {
          title: blog.title,
          tags: blog.tags,
          blogText: blog.blogText,
        },
      };
      const result = await addBlogCollections.updateOne(
        filter,
        updatedBlog,
        option
      );
      res.send(result);
    });
    // delete blog data
    app.delete("/deleteBlog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await addBlogCollections.deleteOne(query);
      res.send(result);
    });
    //create publish blog
    app.post("/publishBlog/", async (req, res) => {
      const user = req.body;
      const result = await publishedBlogsCollections.insertOne(user);
      res.send(result);
      // console.log(result);
    });
    // get publish blog
    app.get("/publishBlog", async (req, res) => {
      const query = {};
      const cursor = await publishedBlogsCollections.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // unpublish blog
    app.delete("/publishBlog/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      console.log(query);
      const result = await publishedBlogsCollections.deleteOne(query);

      res.send(result);
      console.log(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
