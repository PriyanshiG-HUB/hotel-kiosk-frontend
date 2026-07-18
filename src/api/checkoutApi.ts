import { api } from "./api";

export const checkoutGuestApi = async (bookingId: string) => {
  const response = await api.post("/checkout", { booking_id: bookingId });
  return response.data;
};
