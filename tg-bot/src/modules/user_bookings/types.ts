export interface DatabaseBooking {
  id: number;
  roomName: string; 
  start: string; 
  durationMinutes: number;
  roomNumber: number;
  roomFloor: number;
  roomDescription?: string;
}

export interface GetUserBookingsResponse {
  success: boolean;
  bookings?: DatabaseBooking[];
  message?: string;
}