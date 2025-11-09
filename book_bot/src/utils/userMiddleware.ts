import { TChatData } from "@/types/TChat";
import { isUserLoggedIn, createUserSession } from "./userSession";
import { handleStartAuth } from "@/modules/general/auth";
import { db } from "@/app";

export const userMiddleware = async (ctx: any, chat: TChatData, next: Function) => {
  if (!ctx.from) return next(); 

  const sessionQuery = `
    SELECT telegram_id FROM user_telegram_sessions WHERE telegram_id = $1 LIMIT 1;
  `;
  const sessionResult = await db.query(sessionQuery, [chat.telegramId]);

  if (sessionResult.rows.length === 0) {
    await createUserSession(chat.telegramId, ctx.from.username || null);
  }

  const isLoggedIn = await isUserLoggedIn(chat.telegramId);

  if (!isLoggedIn) {
    await handleStartAuth(chat);
    return;
  }

  return next();
};