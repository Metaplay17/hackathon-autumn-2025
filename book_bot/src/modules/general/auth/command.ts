import { authLogin, authRegister, AUTH_MESSAGES } from './config';
import { authenticateUser, collectAuthData, registerUser } from './service';
import { TChatData } from '@/types/TChat';

export const handleStartAuth = async (chat: TChatData): Promise<void> => {

  const { chatId, bot } = chat;

  await bot.sendMessage(chatId, AUTH_MESSAGES.WELCOME, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: authLogin.commandDescription, callback_data: authLogin.commandName },
          { text: authRegister.commandDescription, callback_data: authRegister.commandName }
        ]
      ]
    }
  });
};


export const handleAuthLogin = async (chat: TChatData): Promise<void> => {

  const { telegramId } = chat;
  const authData = await collectAuthData(chat, false);
  
  if (!authData) {
    return;
  }

  const authResult = await authenticateUser(telegramId, authData.email, authData.password);
  

  if (authResult.success) {
    
    await chat.bot.sendMessage(chat.chatId, AUTH_MESSAGES.LOGIN_SUCCESS);
  }
  else {
    const errorMessage = authResult.message || AUTH_MESSAGES.INVALID_CREDENTIALS;
    await chat.bot.sendMessage(chat.chatId, errorMessage);
  }
};


export const handleAuthRegister = async (chat: TChatData): Promise<void> => {

  const { telegramId } = chat;
  const authData = await collectAuthData(chat, true);
  
  if (!authData) {
    return;
  }

  const authResult = await registerUser(telegramId, authData.email, authData.username!, authData.password);  

  if (authResult.success) {

    await chat.bot.sendMessage(chat.chatId, AUTH_MESSAGES.REGISTRATION_SUCCESS);
  } 
    
  else {
    const errorMessage = authResult.message || AUTH_MESSAGES.INVALID_CREDENTIALS;
    await chat.bot.sendMessage(chat.chatId, errorMessage);
  }
};