import React, { createContext, useContext, useState } from 'react';

export interface ServiceRequest {
  requestId: string;
  category: string;
  categoryIcon: string;
  notes: string;
  roomNumber: string;
  guestName: string;
  requestedAt: string;
  estimatedTime: string;
  status: 'pending' | 'confirmed';
}

interface ServiceRequestContextType {
  serviceRequest: ServiceRequest;
  setServiceRequest: React.Dispatch<React.SetStateAction<ServiceRequest>>;
  resetServiceRequest: () => void;
}

const initialServiceRequest: ServiceRequest = {
  requestId: '',
  category: '',
  categoryIcon: '',
  notes: '',
  roomNumber: '',
  guestName: '',
  requestedAt: '',
  estimatedTime: '',
  status: 'pending',
};

const ServiceRequestContext = createContext<ServiceRequestContextType | undefined>(undefined);

export const ServiceRequestProvider = ({ children }: { children: React.ReactNode }) => {
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest>(initialServiceRequest);

  const resetServiceRequest = () => setServiceRequest(initialServiceRequest);

  return (
    <ServiceRequestContext.Provider value={{ serviceRequest, setServiceRequest, resetServiceRequest }}>
      {children}
    </ServiceRequestContext.Provider>
  );
};

export const useServiceRequest = () => {
  const context = useContext(ServiceRequestContext);
  if (!context) throw new Error('useServiceRequest must be used inside ServiceRequestProvider');
  return context;
};
