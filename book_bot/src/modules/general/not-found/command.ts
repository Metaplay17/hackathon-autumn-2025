import { TChatData } from "../../../types/TChat";
import { notFoundMessage } from "./config";

export const notFoundCommand = ({bot, chatId}: TChatData) => {
  return bot.sendMessage(chatId, notFoundMessage)
}