const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json());
const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const aiRoutes = require("./routes/aiRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
app.use("/ai", aiRoutes);
app.use("/weather", weatherRoutes);
app.use("/", authRoutes);
app.use("/", tripRoutes);

app.get("/", (req, res) => {
  res.send("Home route working");
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      message: "Invalid JSON body",
    });
  }

  next(error);
});
app.listen(5000, () => {
  console.log("Server started on port 5000");
});