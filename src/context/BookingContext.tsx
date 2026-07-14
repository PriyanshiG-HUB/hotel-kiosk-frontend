import React, { createContext, useContext, useState } from 'react';

export type Booking = {
  bookingId: string;

  roomType: string;
  roomPrice: number;
  roomNo: string;

  guest: {
    fullName: string;
    mobile: string;
    email: string;
    nationality: string;
    idType: string;
    idNumber: string;
  };

  stay: {
    checkIn: string;
    checkOut: string;
    nights: number;
  };

  payment: {
    amount: number;
    method: string;
    status: boolean;
  };

  checkedOut?: boolean;
};

type BookingContextType = {
  booking: Booking;
  setBooking: React.Dispatch<React.SetStateAction<Booking>>;

  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;

  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  findBooking: (bookingId: string) => Booking | undefined;
  findBookingByRoom: (roomNo: string) => Booking | undefined;
  findBookingByGuest: (guestName: string) => Booking | undefined;
  deleteBooking: (bookingId: string) => void;
};

const initialBooking: Booking = {
  bookingId: '',
  roomType: '',
  roomPrice: 0,
  roomNo: '',

  guest: {
    fullName: '',
    mobile: '',
    email: '',
    nationality: '',
    idType: '',
    idNumber: '',
  },

  stay: {
    checkIn: '',
    checkOut: '',
    nights: 0,
  },

  payment: {
    amount: 0,
    method: '',
    status: false,
  },
};

const BookingContext = createContext<
  BookingContextType | undefined
>(undefined);

export const BookingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [booking, setBooking] =
    useState<Booking>(initialBooking);

const [bookings, setBookings] = useState<Booking[]>([
  {
    bookingId: '12345',
    roomType: 'Deluxe',
    roomPrice: 100,
    roomNo: '101',
    guest: {
      fullName: 'John Doe',
      mobile: '9999999999',
      email: 'john@test.com',
      nationality: 'Indian',
      idType: 'Passport',
      idNumber: 'ABC123',
    },
    stay: {
      checkIn: '2026-07-13',
      checkOut: '2026-07-14',
      nights: 1,
    },
    payment: {
      amount: 100,
      method: 'credit',
      status: true,
    },
  },
]);

  const addBooking = (newBooking: Booking) => {
    setBookings(prev => {
      const exists = prev.find(
        item =>
          item.bookingId === newBooking.bookingId
      );

      if (exists) {
        return prev;
      }

      return [...prev, newBooking];
    });
  };

  const updateBooking = (
    updatedBooking: Booking
  ) => {
    setBookings(prev =>
      prev.map(item =>
        item.bookingId ===
        updatedBooking.bookingId
          ? updatedBooking
          : item
      )
    );
  };

  const findBooking = (bookingId: string) => {
    return bookings.find(
      item =>
        item.bookingId.trim() ===
        bookingId.trim()
    );
  };

  const findBookingByRoom = (
    roomNo: string
  ) => {
    return bookings.find(
      item =>
        item.roomNo.toLowerCase().trim() ===
        roomNo.toLowerCase().trim()
    );
  };

  const findBookingByGuest = (
    guestName: string
  ) => {
    return bookings.find(item =>
      item.guest.fullName
        .toLowerCase()
        .includes(
          guestName.toLowerCase().trim()
        )
    );
  };

  const deleteBooking = (
    bookingId: string
  ) => {
    setBookings(prev =>
      prev.filter(
        item => item.bookingId !== bookingId
      )
    );
  };

  return (
    <BookingContext.Provider
      value={{
        booking,
        setBooking,

        bookings,
        setBookings,

        addBooking,
        updateBooking,
        findBooking,
        findBookingByRoom,
        findBookingByGuest,
        deleteBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context =
    useContext(BookingContext);

  if (!context) {
    throw new Error(
      'useBooking must be used inside BookingProvider'
    );
  }

  return context;
};