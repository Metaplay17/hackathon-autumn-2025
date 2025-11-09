// service/bookingService.ts
import { DatabaseBooking, GetUserBookingsResponse } from "./types";
import { db } from "@/app";
import { serverAdress } from "@/app"; 
import { getToken } from "@/utils";

interface ServerUserProfileResponse {
  status: string;
  message: string;
  username: string;
  bookings: DatabaseBooking[]; 
}

export const getUserBookings = async (
  telegramId: number
): Promise<GetUserBookingsResponse> => {
  try {

    const token = await getToken(telegramId);
    console.log(token);

    if (!token) {
      return { success: false, message: 'Токен авторизации отсутствует' };
    }

    const response = await fetch(`${serverAdress}/api/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        await db.query(
          'UPDATE user_telegram_sessions SET is_logged_in = FALSE, token = NULL WHERE telegram_id = $1',
          [telegramId]
        );
        console.log(response)
        return { success: false, message: 'Сессия истекла. Пожалуйста, войдите снова.' };
      }

      let errorText = `HTTP error! status: ${response.status}`;
      try {
        const errorJson = await response.json();
        errorText = errorJson.message || errorText;
      } catch (e) {
        errorText = await response.text() || errorText;
      }
      throw new Error(errorText);
    }

    const data: ServerUserProfileResponse = await response.json();

    if (data.status === 'OK') {
      return { success: true, bookings: data.bookings };
    } else {
      return { success: false, message: data.message || 'Error getting bookings' };
    }
  } catch (error) {
    console.error('Error getting user bookings from server:', error);
    if (error instanceof Error) {
      return { success: false, message: `Server error: ${error.message}` };
    }
    return { success: false, message: 'Server error' };
  }
};


export const formatBookingMessage = (bookings: DatabaseBooking[]): string => {
  if (bookings.length === 0) {
    return 'У вас нет активных бронирований.';
  }

  const bookingMessages = bookings.map(booking => {
    const startDate = new Date(booking.start);
    const formattedDate = startDate.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const endDate = new Date(startDate.getTime() + booking.durationMinutes * 60000);
    const formattedEndDate = endDate.toLocaleString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });

    let roomInfo = `${booking.roomName}`;
    if (booking.roomDescription) {
      roomInfo += ` (${booking.roomDescription})`;
    }

    return `• ${roomInfo} - ${formattedDate} - ${formattedEndDate} (${booking.durationMinutes} мин)`;
  });

  return `Ваши бронирования:\n\n${bookingMessages.join('\n')}`;
};



export const cancelBooking = async (
  telegramId: number,
  bookingId: number
): Promise<{ success: boolean; message?: string }> => {
  try {
    const token = await getToken(telegramId);
    console.log(token);

    if (!token) {
      return { success: false, message: 'Токен авторизации отсутствует' };
    }

    const response = await fetch(`${serverAdress}/api/bookings/cancel`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ bookingId: bookingId })
    });

    if (!response.ok) {
      if (response.status === 401) {
        await db.query(
          'UPDATE user_telegram_sessions SET is_logged_in = FALSE, token = NULL WHERE telegram_id = $1',
          [telegramId]
        );
        return { success: false, message: 'Сессия истекла. Пожалуйста, войдите снова.' };
      }

      let errorText = `HTTP error! status: ${response.status}`;
      try {
        const errorJson = await response.json();
        errorText = errorJson.message || errorText;
      } catch (e) {
        errorText = await response.text() || errorText;
      }
      throw new Error(errorText);
    }

    const result = await response.json(); 

    if (result.status === 'OK') {
      return { success: true };
    } else {
      return { success: false, message: result.message || 'Error cancelling booking' };
    }
  } catch (error) {
    console.error('Error cancelling booking:', error);
    if (error instanceof Error) {
      return { success: false, message: `Server error: ${error.message}` };
    }
    return { success: false, message: 'Server error' };
  }
};