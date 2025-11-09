  import { TChatData } from '@/types/TChat';
  import { bookingSessions } from "../command";
  import { selectStartTime } from './config';

  export const handleDateSelection = async (
    chat: TChatData,
    dayOffset: number 
  ): Promise<void> => {
    const { telegramId, chatId, bot } = chat;

    try {
      const session = bookingSessions.get(telegramId);
      if (!session || session.step !== 'selecting_date') {
        await bot.sendMessage(chatId, 'Ошибка синхронизации. Пожалуйста, начните заново.');
        return;
      }

      if (!session.availableSlots) {
        await bot.sendMessage(chatId, 'Ошибка: доступные слоты не найдены.');
        return;
      }
      session.step = 'selecting_time';
      const selectedDate = new Date();
      selectedDate.setDate(selectedDate.getDate() + dayOffset);
      const selectedDateStr = selectedDate.toISOString().split('T')[0];

      const slotsForDate = session.availableSlots.filter(slot => slot.start.startsWith(selectedDateStr));

      if (slotsForDate.length === 0) {
        await bot.sendMessage(chatId, `На дату ${selectedDateStr} больше нет доступных слотов для выбранной комнаты.`);
        return;
      }

      slotsForDate.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

      const formattedSelectedDate = selectedDate.toLocaleDateString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric', weekday: 'long'
      });
      let timeMessage = `Доступные времена на ${formattedSelectedDate}:\n\n`;

      const timeKeyboard = [];
      for (const slot of slotsForDate) {
        const startTime = new Date(slot.start);
        const formattedTime = startTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

        timeKeyboard.push([
          { text: formattedTime, callback_data: `${selectStartTime.commandName}_id_${slot.id}` } 
        ]);
      }

      await bot.sendMessage(chatId, timeMessage + 'Выберите время начала:', {
        reply_markup: {
          inline_keyboard: timeKeyboard
        }
      });

    } catch (error) {
      console.error('Error in handleDateSelection:', error);
      await bot.sendMessage(chatId, 'Произошла ошибка при выборе даты.');
    }
  };