import API from "./api";

export const generateKeyMoments = async (videoId) => {
  const response = await API.post(`/keymoments/generate/${videoId}`);
  return response.data;
};

export const getKeyMoments = async (videoId) => {
  const response = await API.get(`/keymoments/${videoId}`);
  return response.data;
};