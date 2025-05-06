require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes/route"); 

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(cors());
app.use(express.json());  // Middleware to parse JSON
app.use(express.urlencoded({ extended: true })); // Middleware to parse form data (x-www-form-urlencoded)

// Test route (optional, you can keep this for debugging)
app.get("/", (req, res) => {
  res.send("testing route");
});

// Mount routes under /api for consistency
app.use("/api", routes);

// Global error handler
app.use((err, req, res, next) => {
  // Use err.statusCode if available (from AppError), otherwise default to 500
  const statusCode = err.statusCode || 500;
  // Use err.status if available (from AppError: "fail" or "error"), otherwise default based on statusCode
  const status = err.status || (statusCode.toString().startsWith("4") ? "fail" : "error");

  res.status(statusCode).json({
    status: status,
    message: err.message || "Internal Server Error",
  });
});

app.listen(port, () => {
  console.log(`beepsafeabraham server is listening at ${port}`);
});
