const {
  getWeather
} = require("../services/weatherService");

const fetchWeather = async (req, res) => {

  try {

    const city = req.params.city;

    const weather = await getWeather(city);

    res.status(200).json(weather);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to fetch weather"
    });

  }

};

module.exports = {
  fetchWeather
};