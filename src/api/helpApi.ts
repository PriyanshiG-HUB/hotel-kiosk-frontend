import { api } from "./api";

export const createHelpRequest = async (helpData: {
  room_number: string;
  guest_name: string;
  help_type: string;
  notes: string;
}) => {
  const response = await api.post("/help/help-requests", helpData);
  return response.data;
};
