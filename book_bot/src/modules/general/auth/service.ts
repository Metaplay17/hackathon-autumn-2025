import { AUTH_CONFIG, AUTH_MESSAGES } from './config';
import { TChatData } from '@/types/TChat';
import { setUserLoggedIn, getUsername, waitForMessage } from '@/utils';
import { serverAdress } from '@/app';
import { db } from '@/app';

interface IAuthAttempt {
  date: string; // YYYY-MM-DD
  attempts: number;
}

const authAttempts = new Map<number, IAuthAttempt>(); 

export const isWithinDailyLimit = (telegramId: number): boolean => {
  const today = new Date().toISOString().split('T')[0];
  const userAttempts = authAttempts.get(telegramId);

  if (!userAttempts || userAttempts.date !== today) {
    authAttempts.set(telegramId, { date: today, attempts: 1 });
    return true;
  }

  if (userAttempts.attempts >= AUTH_CONFIG.MAX_ATTEMPTS_PER_DAY) {
    return false;
  }

  authAttempts.set(telegramId, {
    ...userAttempts,
    attempts: userAttempts.attempts + 1
  });
  return true;
};

export const validateEmail = (email: string): boolean => {
  return AUTH_CONFIG.EMAIL_REGEX.test(email);
};

export const validateUsername = (username: string): boolean => {
  // Только латиница, цифры, _, -, . длиной 3-30 символов
  return /^[a-zA-Z0-9_.-]{3,30}$/.test(username);
};

export const validatePassword = (password: string): boolean => {
  return AUTH_CONFIG.PASSWORD_REGEX.test(password);
};

export const registerUser = async (
  telegramId: number,
  email: string,
  username: string,
  password: string
): Promise<{ success: boolean; message?: string; userId?: number; token?: string }> => {
  try {
    const response = await fetch(`${serverAdress}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, username, password }),
    });

    const result = await response.json();

    console.log(result, result.token, result.message);

    if (response.ok) {
      // Сохраняем username и token в таблицу
      const updateQuery = `
        UPDATE user_telegram_sessions 
        SET username = $2, is_logged_in = FALSE
        WHERE telegram_id = $1;
      `;
      await db.query(updateQuery, [telegramId, username]);

      return { success: true, token: result.token };
    } else {
      return { success: false, message: result.message || 'Registration failed' };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Server error' };
  }
};

export const authenticateUser = async (
  telegramId: number,
  email: string,
  password: string, 
): Promise<{ success: boolean; message?: string; userId?: number; token?: string }> => {
  try {
    const response = await fetch(`${serverAdress}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    console.log(result);

    if (response.ok) {
      let username = result.username;
      if (!username) {
        username = await getUsername(telegramId);
      }

      if (username) {
        const updateQuery = `
          UPDATE user_telegram_sessions 
          SET is_logged_in = TRUE, token = $2 
          WHERE telegram_id = $1;
        `;
        await db.query(updateQuery, [telegramId, result.token]);

        return { success: true, token: result.token };
      }

      return { success: false, message: 'Не удалось получить имя пользователя' };
    } else {
      return { success: false, message: result.message || 'Invalid credentials' };
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, message: 'Server error' };
  }
};

export const collectAuthData = async (
  chat: TChatData,
  isRegistration: boolean = false
): Promise<{ email: string; password: string; username?: string } | null> => {
  const { chatId, bot, telegramId } = chat;

  if (!isWithinDailyLimit(telegramId)) {
    await bot.sendMessage(chatId, AUTH_MESSAGES.TOO_MANY_ATTEMPTS);
    return null;
  }

  await bot.sendMessage(chatId, AUTH_MESSAGES.EMAIL_REQUEST);
  const emailResult = await waitForMessage({ chat, maxWaitingTime: AUTH_CONFIG.WAIT_TIME_MS });

  if (emailResult.type !== 'message') return null;

  let email = emailResult.value.text?.trim() || '';

  while (!validateEmail(email)) {
    await bot.sendMessage(chat.chatId, AUTH_MESSAGES.INVALID_EMAIL);
    const retryEmailResult = await waitForMessage({ chat, maxWaitingTime: AUTH_CONFIG.WAIT_TIME_MS });
    
    if (retryEmailResult.type !== 'message') return null;
    email = retryEmailResult.value.text?.trim() || '';
  }

  let username: string | undefined;

  if (isRegistration) {
    await bot.sendMessage(chatId, AUTH_MESSAGES.USERNAME_REQUEST);
    const usernameResult = await waitForMessage({ chat, maxWaitingTime: AUTH_CONFIG.WAIT_TIME_MS });

    if (usernameResult.type !== 'message') return null;

    let inputUsername = usernameResult.value.text?.trim() || '';
    while (!validateUsername(inputUsername)) {
      await bot.sendMessage(chatId, AUTH_MESSAGES.INVALID_USERNAME);
      const retryUsernameResult = await waitForMessage({ chat, maxWaitingTime: AUTH_CONFIG.WAIT_TIME_MS });
      
      if (retryUsernameResult.type !== 'message') return null;
      inputUsername = retryUsernameResult.value.text?.trim() || '';
    }
    username = inputUsername;
  }

  await bot.sendMessage(chatId, AUTH_MESSAGES.PASSWORD_REQUEST);
  const passwordResult = await waitForMessage({ chat, maxWaitingTime: AUTH_CONFIG.WAIT_TIME_MS });

  if (passwordResult.type !== 'message') return null;

  let password = passwordResult.value.text || '';
  while (!validatePassword(password)) {
    await bot.sendMessage(chatId, AUTH_MESSAGES.INVALID_PASSWORD);
    const retryPasswordResult = await waitForMessage({ chat, maxWaitingTime: AUTH_CONFIG.WAIT_TIME_MS });
    
    if (retryPasswordResult.type !== 'message') return null;
    password = retryPasswordResult.value.text || '';
  }

  return { email, password, username };
};