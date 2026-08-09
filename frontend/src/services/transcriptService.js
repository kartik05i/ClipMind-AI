import API from "./api";

export const generateTranscript = async (videoId) => {
  const response = await API.post(
    `/transcripts/generate/${videoId}`
  );

  return response.data;
};

export const getTranscript = async (videoId) => {
  const response = await API.get(
    `/transcripts/${videoId}`
  );

  return response.data;
};