import { api } from "./api";

export const mapBooking = (dbBooking: any) => {
  if (!dbBooking) return null;
  return {
    ...dbBooking,
    bookingId: dbBooking.booking_id,
    roomNo: dbBooking.rooms?.room_number,
    roomType: dbBooking.rooms?.room_type,
    roomPrice: dbBooking.rooms?.price_per_night || (dbBooking.total_amount / (dbBooking.nights || 1)),
    guest: dbBooking.guests ? {
      fullName: dbBooking.guests.full_name,
      mobile: dbBooking.guests.mobile,
      email: dbBooking.guests.email,
      nationality: dbBooking.guests.nationality || 'Indian',
      idType: dbBooking.guests.id_type || 'Passport',
      idNumber: dbBooking.guests.id_number || '',
    } : {
      fullName: '',
      mobile: '',
      email: '',
      nationality: '',
      idType: '',
      idNumber: '',
    },
    stay: {
      checkIn: dbBooking.check_in,
      checkOut: dbBooking.check_out,
      nights: dbBooking.nights,
    },
    payment: {
      amount: dbBooking.total_amount,
      method: 'credit',
      status: dbBooking.booking_status === 'confirmed',
    },
    check_in_date: dbBooking.check_in,
    check_out_date: dbBooking.check_out,
  };
};

export const searchBooking = async (mobile: string) => {
  const response = await api.get(`/bookings/search/${mobile}`);
  return mapBooking(response.data);
};

export const getBookingById = async (bookingId: string) => {
  const response = await api.get(`/bookings/${bookingId}`);
  return mapBooking(response.data);
};

export const createBooking = async (bookingData: {
  guest_id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  nights: number;
  total_amount: number;
}) => {
  const response = await api.post("/bookings", bookingData);
  return mapBooking(response.data[0] || response.data);
};

export const getRooms = async () => {
  const response = await api.get("/rooms");
  return response.data;
};

export const getBookingByRoom = async (roomNo: string) => {
  const response = await api.get(`/bookings/room/${roomNo}`);
  return mapBooking(response.data);
};

export const getBookingByGuestName = async (name: string) => {
  const response = await api.get(`/bookings/search/guest/${name}`);
  return mapBooking(response.data);
};