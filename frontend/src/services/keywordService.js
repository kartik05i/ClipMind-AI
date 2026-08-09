import API from "./api";

export const generateKeywords = async (videoId) => {
  const response = await API.post(`/keywords/generate/${videoId}`);
  return response.data;
};

export const getKeywords = async (videoId) => {
  const response = await API.get(`/keywords/${videoId}`);
  return response.data;
};