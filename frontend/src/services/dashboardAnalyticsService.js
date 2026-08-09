import API from "./api";

export const getDashboardAnalytics = async () => {
    const response = await API.get("/dashboard/analytics");
    return response.data;
};