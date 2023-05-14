import axios from "axios";
import express from "express";

const app = express();

app.use(express.json());
app.use("/", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

const events = [];

app.get("/events", (req, res) => {
  res.send(events);
});

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event);

  try {
    axios.post("http://posts-clusterip-srv:4000/events/", event);
    axios.post("http://comments-srv:4001/events/", event);
    axios.post("http://query-srv:4002/events", event);
    axios.post("http://moderation-srv:4003/events", event);
  } catch (error) {
    console.log(error);
  }

  res.send({ status: "ok" });
});

app.listen(4005, () => {
  console.log("Listening on 4005");
});
