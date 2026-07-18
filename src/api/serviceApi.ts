import { api } from "./api";

export const createServiceRequest = async (
  data: any
) => {
  const response = await api.post(
    "/service-requests",
    data
  );

  return response.data;
};