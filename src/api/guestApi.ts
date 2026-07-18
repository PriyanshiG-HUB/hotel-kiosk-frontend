import { api } from './api';

export const createGuest = async (
  guestData: any
) => {
  const response = await api.post(
    '/guests',
    guestData
  );

  return response.data;
};