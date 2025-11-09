import TelegramBot from "node-telegram-bot-api";
import { TChatData } from "../types/TChat";
import { notFoundCommand } from "../modules/general/not-found";
import { startConfig, startCommand } from "@/modules/general/start";
import { userMiddleware } from "@/utils";
import { myBookingsConfig, handleMyBookingsCommand, cancelConfig, handleShowBookingsForCancellation } from "@/modules/user_bookings";
import { bookConfig, handleStartBookingCommand } from "@/modules/book";


export const commandHandler = (bot: TelegramBot, message: TelegramBot.Message) => {
  const text = message.text ?? ''
  const chatId = message.chat.id
  const telegramId = message.from?.id

  if (!telegramId) return null

  const chatData: TChatData = {
    bot,
    chatId,
    telegramId
  }

  switch (text) {
    case (startConfig.commandName):
      return userMiddleware(message, chatData, () => startCommand(chatData, message));

    case (myBookingsConfig.commandName):
      return userMiddleware(message, chatData, () => handleMyBookingsCommand(chatData));

    case (bookConfig.commandName):
      return userMiddleware(message, chatData, () => handleStartBookingCommand(chatData, 1));
    
    case (cancelConfig.commandName):
      return userMiddleware(message, chatData, () => handleShowBookingsForCancellation(chatData));
    
    default:
      if(text.startsWith('/'))
        return notFoundCommand(chatData)
       
  }
}