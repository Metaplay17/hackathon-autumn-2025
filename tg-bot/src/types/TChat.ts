import TelegramBot from "node-telegram-bot-api";

export type TChatData = {
  chatId: number,
  telegramId: number,
  bot: TelegramBot
}