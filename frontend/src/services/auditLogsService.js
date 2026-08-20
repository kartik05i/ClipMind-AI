import api from "./api";


export const getAuditLogs = async (
  search = "",
  category = "All"
) => {

  const response = await api.get(
    "/audit-logs/",
    {
      params: {
        search,
        category,
      },
    }
  );

  return response.data;

};