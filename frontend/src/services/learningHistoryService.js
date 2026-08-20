import api from "./api";

export const saveLearningHistory = async (
  videoId,
  activity
) => {
  const response = await api.post(
    `/learning-history/save/${videoId}`,
    null,
    {
      params: {
        activity: activity,
      },
    }
  );

  return response.data;
};

export const getLearningHistory = async () => {
  const response = await api.get("/learning-history/");

  return response.data;
};