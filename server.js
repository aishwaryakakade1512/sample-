require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./config/db");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/api", require("./routes/auth.routes"));

// default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login.html"));
});

// PORT FIX (IMPORTANT)
const PORT = process.env.PORT || 3000;

// DB + server start
sequelize.authenticate()
  .then(() => {
    console.log("DB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB connection failed:", err);
  });