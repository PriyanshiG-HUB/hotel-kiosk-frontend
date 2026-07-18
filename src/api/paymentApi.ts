import { api } from "./api";

export const createPayment = async (
  paymentData: any
) => {
  const response = await api.post(
    "/payments",
    paymentData
  );

  return response.data;
};