import api from "./api";

export const getWeather = async (city: string) => {
  const response = await api.get(`/weather/${city}`);
  return response.data;
};