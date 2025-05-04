require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const routes = require("./routes/route");

const prisma = new PrismaClient();
const app = express();
const port = process.env.APP_PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("testing route");
});

app.use("/", routes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

app.listen(port, () => {
  console.log(`beebsafe server is listening at ${port}`);
});
