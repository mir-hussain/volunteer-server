import express from "express";
import cors from "cors";
import mongodb from "mongodb";

//dotenv
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const MongoClient = mongodb.MongoClient;

const userName = process.env.USER_NAME;
const password = process.env.PASS;
const databaseName = process.env.DB_NAME;

const uri = `mongodb+srv://${userName}:${password}@cluster0.lfvk2.mongodb.net/${databaseName}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
  console.log(err);
  const eventCollection = client.db(databaseName).collection("event");
  app.post("/addEvent", (req, res) => {
    const newEvent = req.body;
    eventCollection.insertOne(newEvent).then((result) => {
      res.status(200).send(result.insertedCount > 0);
    });
  });

  app.get("/events", (req, res) => {
    eventCollection.find().toArray((err, event) => {
      res.status(200).send(event);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log("server is running on port: " + PORT);
});
