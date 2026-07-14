import React, { createContext, useContext, useState } from 'react';

export interface Visitor {
  visitorId: string;
  fullName: string;
  mobile: string;
  purpose: string;
  hostRoom: string;
  hostGuest: string;
  idType: string;
  idNumber: string;
  visitDate: string;
  visitTime: string;

  status: 'Checked In' | 'Checked Out';

  checkOutTime?: string;
}

interface VisitorContextType {
  visitor: Visitor;
  setVisitor: React.Dispatch<React.SetStateAction<Visitor>>;

  visitors: Visitor[];

  addVisitor: (visitor: Visitor) => void;

  findVisitorById: (
    visitorId: string,
  ) => Visitor | undefined;

  findVisitorByName: (
    fullName: string,
  ) => Visitor | undefined;

  resetVisitor: () => void;
  checkOutVisitor: (
  visitorId: string
) => void;
}

const initialVisitor: Visitor = {
  visitorId: '',

  fullName: '',
  mobile: '',

  purpose: '',
  hostRoom: '',
  hostGuest: '',

  idType: 'Aadhar',
  idNumber: '',

  visitDate: '',
visitTime: '',

status: 'Checked In',
checkOutTime: '',
};

const VisitorContext = createContext<VisitorContextType | undefined>(
  undefined,
);

export const VisitorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [visitor, _setVisitor] = useState(initialVisitor);
  const [visitors, setVisitors] = useState<Visitor[]>([]);

const setVisitor: React.Dispatch<React.SetStateAction<Visitor>> = (value) => {
  _setVisitor(prev => {
    const newValue =
      typeof value === 'function'
        ? value(prev)
        : value;


    return newValue;
  });
};
const addVisitor = (newVisitor: Visitor) => {
  setVisitors(prev => [...prev, newVisitor]);

  setVisitor(newVisitor);
};

const findVisitorById = (visitorId: string) => {
  return visitors.find(
    visitor =>
      visitor.visitorId.toLowerCase() ===
      visitorId.toLowerCase().trim()
  );
};

const findVisitorByName = (fullName: string) => {
  return visitors.find(visitor =>
    visitor.fullName
      .toLowerCase()
      .includes(fullName.toLowerCase().trim())
  );
};

const checkOutVisitor = (
  visitorId: string
) => {
  const checkoutTime =
    new Date().toLocaleTimeString();

  setVisitors(prev =>
    prev.map(visitor =>
      visitor.visitorId === visitorId
        ? {
            ...visitor,
            status: 'Checked Out',
            checkOutTime: checkoutTime,
          }
        : visitor
    )
  );

  setVisitor(prev =>
    prev.visitorId === visitorId
      ? {
          ...prev,
          status: 'Checked Out',
          checkOutTime: checkoutTime,
        }
      : prev
  );
};

  const resetVisitor = () => {
    setVisitor(initialVisitor);
  };

  return (
    <VisitorContext.Provider
      value={{
  visitor,
  setVisitor,
  visitors,
  addVisitor,
  findVisitorById,
  findVisitorByName,
  checkOutVisitor,
  resetVisitor,
}}
    >
      {children}
    </VisitorContext.Provider>
  );
};


export const useVisitor = () => {
  const context = useContext(VisitorContext);

  if (!context) {
    throw new Error(
      'useVisitor must be used inside VisitorProvider'
    );
  }

  return context;
};