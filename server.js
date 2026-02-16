const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Middleware Global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.set("view engine", "ejs");

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/product", require("./routes/product"));

// Home Route (Redirect to Product List)
app.get("/", (req, res) => {
  res.redirect("/product");
});

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).render("404", { url: req.originalUrl }); // You might need to create a 404 view
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));