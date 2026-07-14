import React, { createContext, useContext, useState } from 'react';

export interface HelpRequest {
  requestId: string;
  service: string;
  serviceIcon: string;
  roomNumber: string;
  guestName: string;
  requestedAt: string;
  estimatedTime: string;
  status: 'pending' | 'confirmed';
  notes: string;
}

interface NeedHelpContextType {
  helpRequest: HelpRequest;
  setHelpRequest: React.Dispatch<React.SetStateAction<HelpRequest>>;
  resetNeedHelp: () => void;
}

const initialHelpRequest: HelpRequest = {
  requestId: '',
  service: '',
  serviceIcon: '',
  roomNumber: '',
  guestName: '',
  requestedAt: '',
  estimatedTime: '',
  status: 'pending',
  notes: '',
};

const NeedHelpContext = createContext<NeedHelpContextType | undefined>(undefined);

export const NeedHelpProvider = ({ children }: { children: React.ReactNode }) => {
  const [helpRequest, setHelpRequest] = useState<HelpRequest>(initialHelpRequest);

  const resetNeedHelp = () => setHelpRequest(initialHelpRequest);

  return (
    <NeedHelpContext.Provider value={{ helpRequest, setHelpRequest, resetNeedHelp }}>
      {children}
    </NeedHelpContext.Provider>
  );
};

export const useNeedHelp = () => {
  const context = useContext(NeedHelpContext);
  if (!context) throw new Error('useNeedHelp must be used inside NeedHelpProvider');
  return context;
};
