import API from "./api";

export const generateSummary = async (videoId) => {
  const response = await API.post(
    `/summaries/generate/${videoId}`
  );

  return response.data;
};

export const getSummary = async (videoId) => {
  const response = await API.get(
    `/summaries/${videoId}`
  );

  return response.data;
};