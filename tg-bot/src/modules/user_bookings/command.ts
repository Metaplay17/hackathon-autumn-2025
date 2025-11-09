import { TChatData } from '@/types/TChat';
import { getUserBookings, formatBookingMessage } from './service';
import { cancelBooking } from './service';
import { cancelBookingConfig } from './config';

export const handleMyBookingsCommand = async (chat: TChatData): Promise<void> => {
  const { telegramId, chatId, bot } = chat;

  try {
    const result = await getUserBookings(telegramId);

    if (result.success && result.bookings) {
      const message = formatBookingMessage(result.bookings);
      await bot.sendMessage(chatId, message);
    } else {
      const errorMessage = result.message || 'Не удалось получить бронирования';
      await bot.sendMessage(chatId, errorMessage);
    }
  } catch (error) {
    console.error('Error in handleMyBookingsCommand:', error);
    await bot.sendMessage(chatId, 'Произошла ошибка при получении бронирований.');
  }
};


export const handleShowBookingsForCancellation = async (chat: TChatData): Promise<void> => {
  const { telegramId, chatId, bot } = chat;

  try {
    const result = await getUserBookings(telegramId);

    if (!result.success) {
      await bot.sendMessage(chatId, result.message || 'Не удалось получить бронирования.');
      return;
    }

    const bookings = result.bookings || [];

    if (bookings.length === 0) {
      await bot.sendMessage(chatId, 'У вас нет активных бронирований для отмены.');
      return;
    }

    let message = "Ваши бронирования. Выберите, которое хотите отменить:\n\n";

    const inlineKeyboard = [];

    for (const booking of bookings) {
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

      message += `• ${booking.roomName} - ${formattedDate} - ${formattedEndDate} (${booking.durationMinutes} мин)\n`;

      inlineKeyboard.push([
        {
          text: `❌ Отменить ${booking.roomName} ${formattedDate}`,
          callback_data: `${cancelBookingConfig.commandName}_id_${booking.id}` 
        }
      ]);
    }

    await bot.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: inlineKeyboard
      }
    });

  } catch (error) {
    console.error('Error in handleShowBookingsForCancellation:', error);
    await bot.sendMessage(chatId, 'Произошла ошибка при получении бронирований.');
  }
};


export const handleBookingCancellationRequest = async (
  chat: TChatData,
  bookingId: number 
): Promise<void> => {
  const { telegramId, chatId, bot } = chat;

  try {

    const cancelResult = await cancelBooking(telegramId, bookingId);

    if (cancelResult.success) {
      await bot.sendMessage(chatId, `✅ Бронирование успешно отменено.`);

    } else {
      await bot.sendMessage(chatId, `❌ Ошибка при отмене бронирования: ${cancelResult.message || 'Неизвестная ошибка'}`);
    }

  } catch (error) {
    console.error('Error in handleBookingCancellationRequest:', error);
    await bot.sendMessage(chatId, 'Произошла ошибка при отмене бронирования.');
  }
};
