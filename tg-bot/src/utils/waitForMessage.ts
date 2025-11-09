import { TChatData } from "@/types/TChat";
import { Message } from "node-telegram-bot-api";

type WaitForMessageResult =
  | { type: 'message'; value: Message }
  | { type: 'timeout' }
  | { type: 'inline_keyboard' };

type TWaitForMessageArguments = {
  chat: TChatData;
  maxWaitingTime?: number; // ms
};



export const waitForMessage = ({
                                 chat,
                                 maxWaitingTime = 300_000,
                               }: TWaitForMessageArguments): Promise<WaitForMessageResult> => {
  return new Promise((resolve) => {
    const onMessage = (message: Message) => {
      const receivedChatId = message.chat.id;
      const receivedUserId = message.from?.id;

      if (receivedChatId === chat.chatId && receivedUserId === chat.telegramId) {
        chat.bot.off('message', onMessage);
        chat.bot.off('callback_query', onCallbackQuery);
        clearTimeout(waitingTimer);
        resolve({ type: 'message', value: message });
      }
    };

    const onCallbackQuery = (callbackQuery: any) => {
      const receivedChatId = callbackQuery.message?.chat.id;
      const receivedUserId = callbackQuery.from.id;

      if (receivedChatId === chat.chatId && receivedUserId === chat.telegramId) {
        chat.bot.off('message', onMessage);
        chat.bot.off('callback_query', onCallbackQuery);
        clearTimeout(waitingTimer);
        resolve({ type: 'inline_keyboard' });
      }
    };

    chat.bot.on('message', onMessage);
    chat.bot.on('callback_query', onCallbackQuery);

    const waitingTimer = setTimeout(() => {
      chat.bot.off('message', onMessage);
      chat.bot.off('callback_query', onCallbackQuery);
      resolve({ type: 'timeout' });
    }, maxWaitingTime);
  });
};

