import API from "./api";

export const generateHighlights = async (videoId) => {
  const response = await API.post(`/highlights/generate/${videoId}`);
  return response.data;
};

export const getHighlights = async (videoId) => {
  const response = await API.get(`/highlights/${videoId}`);
  return response.data;
};