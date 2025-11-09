import TelegramBot from "node-telegram-bot-api";

import { TChatData } from "../../../types/TChat";
import { buildStartMessage } from "./config";
import { isUserLoggedIn } from "@/utils/userSession";
import { AUTH_MESSAGES } from "../auth/config";
import { authLogin, authRegister } from "../auth";

export const startCommand = async (chat: TChatData, message: TelegramBot.Message): Promise<void> => {

  const { chatId, bot, telegramId } = chat;

  await bot.sendMessage(chatId, buildStartMessage(message.from?.first_name))
  
};