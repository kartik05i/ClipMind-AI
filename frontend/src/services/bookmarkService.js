import api from "./api";


export const saveBookmark = async (
  videoId,
  contentType,
  content
) => {
  const response = await api.post(
    `/bookmarks/save/${videoId}`,
    null,
    {
      params: {
        content_type: contentType,
        content: content,
      },
    }
  );

  return response.data;
};


export const getBookmarks = async () => {
  const response = await api.get("/bookmarks/");

  return response.data;
};


export const deleteBookmark = async (bookmarkId) => {
  const response = await api.delete(
    `/bookmarks/${bookmarkId}`
  );

  return response.data;
};