import api from "./api";

export const getPlatformSettings = async () => {
  const response = await api.get("/platform-settings/");
  return response.data;
};

export const updatePlatformSettings = async (data) => {
  const response = await api.put(
    "/platform-settings/",
    data
  );

  return response.data;
};