import { TChatData } from '@/types/TChat';
import { bookingSessions } from "../command"; 
import { 
  getAllBookings, 
  filterAvailableSlots, 
  groupSlotsByDate,
} from '../service'; 
import { getToken } from '@/utils'; 
import { selectedDate } from './config';

export const handleRoomSelection = async (
  chat: TChatData, 
  roomId: number
): Promise<void> => {
  const { telegramId, chatId, bot } = chat;

  try {
    
    const session = bookingSessions.get(telegramId);
    if (!session || session.step !== 'selecting_room') {
      console.log(session)
      await bot.sendMessage(chatId, 'Неверный шаг бронирования. Пожалуйста, начните заново.');
      return;
    }

    session.selectedRoomId = roomId;
    const token = await getToken(telegramId);

    if (!token) {
      await bot.sendMessage(chatId, 'Токен авторизации отсутствует.');
      return;
    }

    const bookingsData = await getAllBookings(token);

    if (!bookingsData || bookingsData.status !== 'OK') {
      await bot.sendMessage(chatId, 'Не удалось получить доступные слоты.');
      return;
    }

    const availableSlots = filterAvailableSlots(bookingsData.bookings, roomId);

    if (availableSlots.length === 0) {
      await bot.sendMessage(chatId, 'На выбранную комнату нет доступных слотов для бронирования.');
      return;
    }

    const slotsByDate = groupSlotsByDate(availableSlots);

    const uniqueDates = Array.from(slotsByDate.keys()).sort();

    if (uniqueDates.length === 0) {
      await bot.sendMessage(chatId, 'Не найдено доступных дат для выбранной комнаты.');
      return;
    }

    let dateMessage = `Доступные даты для комнаты ${roomId}:\n\n`;

    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const dateKeyboard = [];
    for (const dateStr of uniqueDates) {
      const dateObj = new Date(dateStr);
      dateObj.setHours(0, 0, 0, 0); 

      const timeDiff = dateObj.getTime() - today.getTime();
      const dayOffset = Math.floor(timeDiff / (1000 * 3600 * 24)); 
      
      const formattedDate = dateObj.toLocaleDateString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric', weekday: 'short'
      });

      dateKeyboard.push([
        { text: formattedDate, callback_data: `${selectedDate.commandName}_id_${dayOffset}` }
      ]);
    }

    session.step = 'selecting_date';
    session.selectedRoomId = roomId;
    session.availableSlots = availableSlots; 
    bookingSessions.set(telegramId, session);

    await bot.sendMessage(chatId, dateMessage + 'Выберите дату:', {
      reply_markup: {
        inline_keyboard: dateKeyboard
      }
    });

  } catch (error) {
    console.error('Error in handleRoomSelection:', error);
    await bot.sendMessage(chatId, 'Произошла ошибка при выборе комнаты.');
  }
};