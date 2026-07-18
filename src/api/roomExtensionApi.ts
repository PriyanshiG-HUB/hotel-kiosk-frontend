import { api } from "./api";

export const extendRoom = async (
  extensionData: {
    booking_id: string;
    new_checkout: string;
    additional_nights: number;
    additional_amount: number;
  }
) => {
  const response = await api.post(
    "/room-extensions",
    extensionData
  );

  return response.data;
};