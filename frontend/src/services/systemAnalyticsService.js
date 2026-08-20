import api from "./api";

export const getSystemAnalytics = async () => {
  const response = await api.get("/system-analytics/");

  return response.data;
};