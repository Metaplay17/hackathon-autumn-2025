import { serverAdress } from '@/app';

export interface Room {
  id: number;
  number: number;
  description: string;
  capability: number;
  floor: number;
  photo: string | null;
  open: boolean;
}

export interface BookingSlot {
  id: number;
  isOwner: boolean;
  isFree: boolean;
  roomId: number;
  start: string; 
  durationMinutes: number;
}

export interface GetAllRoomsResponse {
  status: string;
  message: string;
  rooms: Room[];
}

export interface GetAllBookingsResponse {
  status: string;
  message: string;
  bookings: BookingSlot[];
}

export const getAllRooms = async (
  token: string
): Promise<GetAllRoomsResponse | null> => {
  try {
    const response = await fetch(`${serverAdress}/api/rooms/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(`Error fetching rooms: ${response.status}`);
      return null;
    }

    const data: GetAllRoomsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return null;
  }
};

export const getAllBookings = async (
  token: string
): Promise<GetAllBookingsResponse | null> => {
  try {
    const response = await fetch(`${serverAdress}/api/bookings/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(`Error fetching bookings: ${response.status}`);
      return null;
    }

    const data: GetAllBookingsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return null;
  }
};

export const filterAvailableSlots = (
  allBookings: BookingSlot[],
  roomId: number
): BookingSlot[] => {
  return allBookings
    .filter(booking => booking.roomId === roomId && booking.isFree)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
};

export const groupSlotsByDate = (slots: BookingSlot[]): Map<string, BookingSlot[]> => {
  const grouped = new Map<string, BookingSlot[]>();
  slots.forEach(slot => {
    const date = slot.start.split('T')[0]; 
    if (!grouped.has(date)) {
      grouped.set(date, []);
    }
    grouped.get(date)!.push(slot);
  });
  return grouped;
};