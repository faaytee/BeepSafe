require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const routes = require("./routes/route");

const prisma = new PrismaClient();
const app = express();
port = process.env.APP_PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("testing route");
});

app.use("/", routes);

app.listen(port, () => {
  console.log(`beebsafe server is listening at ${port}`);
});
