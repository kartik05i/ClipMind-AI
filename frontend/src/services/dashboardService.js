import API from "./api";

export const getUsageReport = async () => {
  const response = await API.get("/dashboard/usage-report");
  return response.data;
};