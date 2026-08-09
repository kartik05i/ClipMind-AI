import API from "./api";

export const uploadVideo = async (title, file) => {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("file", file);

  const response = await API.post(
    "/videos/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// NEW FUNCTION
export const getAllVideos = async () => {
  const response = await API.get("/videos/");
  console.log("API Response:", response.data);
  return response.data;
};