import axios from "axios";

const API = "http://localhost:5000";

export const getWeather = async (city: string) => {

  const response = await axios.get(
    `${API}/weather/${city}`
  );

  return response.data;
};