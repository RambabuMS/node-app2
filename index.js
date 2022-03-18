// const express = require("express");
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const PORT = process.env.PORT;
app.use(express.json());

app.use(cors());

const MONGO_URL = process.env.MONGO_URL;
async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo is connected ✌️😊");
  return client;
}
const client = await createConnection();

app.get("/", function (req, res) {
  res.send("Welcome Home");
});

// app.get("/cars", function (req, res) {
//   res.send(Carslist);
// });
app.get("/cars", async function (req, res) {
  const cars = await client.db("b30wd").collection("cars").find({}).toArray();
  res.send(cars);
});

app.get("/cars/:id", async function (req, res) {
  console.log(req.params);
  const { id } = req.params;
  //   const car = Carslist.find((car) => car.id === id);
  const car = await client.db("b30wd").collection("cars").findOne({ id: id });
  car
    ? res.send(car)
    : res.status(404).send({ message: "No such car found 😅" });
});

app.post("/cars", async function (req, res) {
  const data = req.body;
  const cars = await client.db("b30wd").collection("cars").insertMany(data);

  res.send(cars);
});

app.put("/cars/:id", async function (req, res) {
  console.log(req.params);
  const { id } = req.params;
  //   const car = Carslist.find((car) => car.id === id);
  const updatedCar = req.body;
  const result = await client
    .db("b30wd")
    .collection("cars")
    .updateOne({ id: id }, { $set: updatedCar });
  res.send(result);
});

app.delete("/cars/:id", async function (req, res) {
  console.log(req.params);
  const { id } = req.params;
  //   const car = Carslist.find((car) => car.id === id);
  const result = await client
    .db("b30wd")
    .collection("cars")
    .deleteOne({ id: id });
  res.send(result);
});

app.listen(PORT, () => {
  console.log("Server is started");
});

// const { id } = request.params;const movie = movies.find((mv) => mv.id === id);response.send(movie);});
