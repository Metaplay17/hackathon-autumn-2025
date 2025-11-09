import TelegramBot from "node-telegram-bot-api";
import { TChatData } from "../types/TChat";
import { handleAuthLogin, handleAuthRegister, authLogin, authRegister } from "@/modules/general/auth";
import { chooseFloor, chooseRoom, handleStartBookingCommand } from "@/modules/book";
import { handleRoomSelection } from "@/modules/book/choose_date";
import { selectedDate } from "@/modules/book/choose_date";
import { handleDateSelection, selectStartTime } from "@/modules/book/choose_start_time";
import { confirmConfig, handleTimeSelection, handleBookingCancellation,
   rejectConfig, handleBookingConfirmation } from "@/modules/book/confirm";
import { cancelBookingConfig, handleBookingCancellationRequest } from "@/modules/user_bookings"; 


export const callbackQueryHandler = async (bot: TelegramBot, message: TelegramBot.CallbackQuery) => {
  const data = message.data ?? '';
  const chatId = message.message?.chat.id;
  const telegramId = message.from.id;
  const messageId = message.message?.message_id;
  const queryId = message.id;
  console.log(data);

  if (!chatId || !telegramId) return;

  try {
    await bot.answerCallbackQuery(queryId);
  } catch (err) {
    console.warn("Не удалось ответить на callback");
  }

  const chatData: TChatData = { bot, chatId, telegramId };
  const { action, id } = parseCallbackData(data);
  const handler = callbackHandlers[action];

  try {
    if (handler) {
      await handler(chatData, id);
    } else {
      await bot.sendMessage(chatId, "Неизвестная команда ⚠️");
    }

    if (messageId) {
      try {
        await bot.deleteMessage(chatId, messageId);
      } catch (err) {
        console.warn("Не удалось удалить сообщение");
      }
    }
  } catch (error) {
    console.error("Ошибка в обработке callback:", error);
    await bot.sendMessage(chatId, "Произошла ошибка при обработке команды.");
  }
};


const callbackHandlers: Record<
  string,
  (chat: TChatData, id?: number | null) => Promise<void>
> = {
    [authLogin.commandName]: async (chat) => { await handleAuthLogin(chat) }, 
    [authRegister.commandName]: async (chat) => { await handleAuthRegister(chat) },
    [chooseFloor.commandName]: async (chat, id)  => { 
      if (id)
        await handleStartBookingCommand(chat, id);
    },
    [chooseRoom.commandName]: async (chat, id) => {
      if (id)
      await handleRoomSelection(chat, id)},
    [selectedDate.commandName]: async (chat, id) => { 
      if(id || id === 0)
        await handleDateSelection(chat, id);
    }, 
    [selectStartTime.commandName]: async(chat, id) => {
      if(id)
        await handleTimeSelection(chat, id);
    },
    [confirmConfig.commandName]: async(chat, id) => {
      if(id)
        await handleBookingConfirmation(chat, id);
    },
    [rejectConfig.commandName]: async(chat) => { await handleBookingCancellation(chat);},
    [cancelBookingConfig.commandName]: async(chat, id) => { 
      if(id)
        handleBookingCancellationRequest(chat, id);
    }


};


function parseCallbackData(data: string): { action: string; id: number | null } {
  if (data.includes("_id_")) {
    const [action, idStr] = data.split("_id_", 2);
    const id = Number(idStr);
    return { action, id: isNaN(id) ? null : id };
  }
  return { action: data, id: null };
}

