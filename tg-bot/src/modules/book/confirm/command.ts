import { TChatData } from '@/types/TChat';
import { bookingSessions } from "../command"; 
import { getToken } from '@/utils'; 
import { serverAdress } from '@/app'; 
import { confirmConfig, rejectConfig } from './config';
export const handleTimeSelection = async (
  chat: TChatData,
  slotId: number 
): Promise<void> => {
  const { telegramId, chatId, bot } = chat;

  try {
    const session = bookingSessions.get(telegramId);
    if (!session || session.step !== 'selecting_time') {
      await bot.sendMessage(chatId, 'Ошибка синхронизации. Пожалуйста, начните заново.');
      return;
    }

    if (!session.availableSlots) {
      await bot.sendMessage(chatId, 'Ошибка: доступные слоты не найдены.');
      return;
    }

    const selectedSlot = session.availableSlots.find(slot => slot.id === slotId);

    if (!selectedSlot) {
      await bot.sendMessage(chatId, 'Выбранный временной слот больше не доступен.');
      return;
    }

    const startTime = new Date(selectedSlot.start);
    const endTime = new Date(startTime.getTime() + selectedSlot.durationMinutes * 60000); // durationMinutes в миллисекунды

    const formattedDate = startTime.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedStartTime = startTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const formattedEndTime = endTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    const confirmationMessage = `Подтвердите бронирование:\n` +
                               `Этаж: ${session.currentFloor}\n` +
                               `Комната: ${session.selectedRoomId}\n` + 
                               `Дата: ${formattedDate}\n` +
                               `Время: ${formattedStartTime} - ${formattedEndTime}\n` +
                               `Длительность: ${selectedSlot.durationMinutes} минут\n\n` +
                               `Нажмите "✅ Подтвердить", чтобы забронировать.`;

    const confirmationKeyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Подтвердить', callback_data: `${confirmConfig.commandName}_id_${slotId}` },
            { text: '❌ Отмена', callback_data: `${rejectConfig.commandName}_id_${slotId}` }
          ]
        ]
      }
    };

    session.step = 'confirming';
    session.selectedSlotId = slotId;
    bookingSessions.set(telegramId, session);

    await bot.sendMessage(chatId, confirmationMessage, confirmationKeyboard);

  } catch (error) {
    console.error('Error in handleTimeSelection:', error);
    await bot.sendMessage(chatId, 'Произошла ошибка при подготовке подтверждения.');

  }
};


export const handleBookingConfirmation = async (
  chat: TChatData,
  slotId: number 
): Promise<void> => {
  const { telegramId, chatId, bot } = chat;

  try {
    const session = bookingSessions.get(telegramId);
    if (!session || session.step !== 'confirming' || session.selectedSlotId !== slotId) {
      await bot.sendMessage(chatId, 'Ошибка синхронизации подтверждения. Пожалуйста, начните заново.');
      return;
    }

    const token = await getToken(telegramId);
    if (!token) {
        await bot.sendMessage(chatId, 'Токен авторизации отсутствует.');
        return;
    }

    const slotToBook = session.availableSlots?.find(slot => slot.id === slotId);

    if (!slotToBook) {
        await bot.sendMessage(chatId, 'Данные о выбранном слоте утеряны. Пожалуйста, начните заново.');
        return;
    }

    const requestBody = { bookingId: slotId }; 


    const response = await fetch(`${serverAdress}/api/bookings/make`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(requestBody) 
    });

    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            errorMessage = await response.text() || errorMessage;
        }
        throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result.status === 'OK') {
        const startTime = new Date(slotToBook.start);
        const endTime = new Date(startTime.getTime() + slotToBook.durationMinutes * 60000);

        const formattedDate = startTime.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const formattedStartTime = startTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        const formattedEndTime = endTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

        await bot.sendMessage(chatId, `✅ Бронирование успешно создано!\nКомната: ${slotToBook.roomId}\nДата: ${formattedDate}\nВремя: ${formattedStartTime} - ${formattedEndTime}\nДлительность: ${slotToBook.durationMinutes} минут`);
        bookingSessions.delete(telegramId);

    } else {
        await bot.sendMessage(chatId, `Ошибка при создании бронирования: ${result.message || 'Неизвестная ошибка'}`);
        bookingSessions.delete(telegramId);
    }

  } catch (error) {
    console.error('Error in handleBookingConfirmation:', error);
    await bot.sendMessage(chatId, `Произошла ошибка при подтверждении бронирования: ${(error as Error).message}`);
    bookingSessions.delete(telegramId);
  }
};



export const handleBookingCancellation = async (
  chat: TChatData
): Promise<void> => {
  const { telegramId, chatId, bot } = chat;

  try {
    const session = bookingSessions.get(telegramId);
    if (session) {
        bookingSessions.delete(telegramId);
    }

    await bot.sendMessage(chatId, 'Бронирование отменено.');


  } catch (error) {
    console.error('Error in handleBookingCancellation:', error);
    await bot.sendMessage(chatId, 'Произошла ошибка при отмене бронирования.');
    bookingSessions.delete(telegramId);
  }
};