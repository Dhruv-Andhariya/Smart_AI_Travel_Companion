const express = require("express");

const router = express.Router();

const {
  fetchWeather
} = require("../controllers/weatherController");

router.get("/:city", fetchWeather);

module.exports = router;