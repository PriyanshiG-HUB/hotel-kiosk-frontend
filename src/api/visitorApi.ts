import { api } from "./api";

export const mapVisitor = (dbVisitor: any) => {
  if (!dbVisitor) return null;

  const checkInDate = new Date(dbVisitor.check_in_time);
  const visitDate = checkInDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const visitTime = checkInDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  let checkOutTime = '';
  if (dbVisitor.check_out_time) {
    const checkOutDate = new Date(dbVisitor.check_out_time);
    checkOutTime = checkOutDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  return {
    ...dbVisitor,
    visitorId: dbVisitor.visitor_id,
    fullName: dbVisitor.full_name,
    mobile: dbVisitor.mobile,
    purpose: dbVisitor.purpose,
    hostRoom: dbVisitor.host_room,
    hostGuest: dbVisitor.host_guest,
    idType: dbVisitor.id_type,
    idNumber: dbVisitor.id_number,
    visitDate,
    visitTime,
    status: dbVisitor.status === 'checked_in' || dbVisitor.status === 'Checked In' ? 'Checked In' : 'Checked Out',
    checkOutTime,
  };
};

export const registerVisitor = async (visitorData: any) => {
  const response = await api.post("/visitors", visitorData);
  return mapVisitor(response.data[0] || response.data);
};

export const getVisitors = async () => {
  const response = await api.get("/visitors");
  return response.data.map(mapVisitor);
};

export const getVisitorById = async (visitorId: string) => {
  const response = await api.get(`/visitors/${visitorId}`);
  return mapVisitor(response.data);
};

export const checkoutVisitorApi = async (visitorId: string) => {
  const response = await api.post("/visitors/checkout", { visitor_id: visitorId });
  return response.data;
};

export const getVisitorByName = async (name: string) => {
  const response = await api.get(`/visitors/search/name/${name}`);
  return response.data.map(mapVisitor);
};