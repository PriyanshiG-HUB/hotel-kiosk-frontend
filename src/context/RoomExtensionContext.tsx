import React, { createContext, useContext, useState } from 'react';

export interface RoomExtension {
  extensionId: string;
  bookingId: string;
  extraNights: number;
  originalCheckOut: string;
  newCheckOut: string;
  roomPrice: number;
  extraRoomCharge: number;
  taxes: number;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: boolean;
}

interface RoomExtensionContextType {
  roomExtension: RoomExtension;
  setRoomExtension: React.Dispatch<React.SetStateAction<RoomExtension>>;
  resetRoomExtension: () => void;
}

const initialRoomExtension: RoomExtension = {
  extensionId: '',
  bookingId: '',
  extraNights: 0,
  originalCheckOut: '',
  newCheckOut: '',
  roomPrice: 0,
  extraRoomCharge: 0,
  taxes: 0,
  grandTotal: 0,
  paymentMethod: '',
  paymentStatus: false,
};

const RoomExtensionContext = createContext<RoomExtensionContextType | undefined>(undefined);

export const RoomExtensionProvider = ({ children }: { children: React.ReactNode }) => {
  const [roomExtension, setRoomExtension] = useState<RoomExtension>(initialRoomExtension);

  const resetRoomExtension = () => {
    setRoomExtension(initialRoomExtension);
  };

  return (
    <RoomExtensionContext.Provider value={{ roomExtension, setRoomExtension, resetRoomExtension }}>
      {children}
    </RoomExtensionContext.Provider>
  );
};

export const useRoomExtension = () => {
  const context = useContext(RoomExtensionContext);
  if (!context) {
    throw new Error('useRoomExtension must be used inside RoomExtensionProvider');
  }
  return context;
};
