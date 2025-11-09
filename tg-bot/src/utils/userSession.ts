import { db } from "@/app";

export const createUserSession = async (
  telegramId: number, 
  username: string | null
): Promise<void> => {
  const query = `
    INSERT INTO user_telegram_sessions (telegram_id, username, is_logged_in)
    VALUES ($1, $2, FALSE)
    ON CONFLICT (telegram_id) 
    DO NOTHING;
  `;
  await db.query(query, [telegramId, username]);
};


export const setUserLoggedIn = async (telegramId: number): Promise<void> => {
  const query = `
    INSERT INTO user_telegram_sessions (telegram_id, is_logged_in)
    VALUES ($1, true)
    ON CONFLICT (telegram_id)
    DO UPDATE SET is_logged_in = true
  `;
  await db.query(query, [telegramId]);
};

export const setUserLoggedOut = async (telegramId: number): Promise<void> => {
  const query = `
    UPDATE user_telegram_sessions 
    SET is_logged_in = false
    WHERE telegram_id = $1
  `;
  await db.query(query, [telegramId]);
};

export const isUserLoggedIn = async (telegramId: number): Promise<boolean> => {
  const query = 'SELECT is_logged_in FROM user_telegram_sessions WHERE telegram_id = $1';
  const result = await db.query(query, [telegramId]);
  return result.rows[0]?.is_logged_in === true;
};

export const getUserSession = async (telegramId: number) => {
  const query = 'SELECT * FROM user_telegram_sessions WHERE telegram_id = $1';
  const result = await db.query(query, [telegramId]);
  return result.rows[0] || null;
};

export const getUsername = async (telegramId: number): Promise<string | null> => {

  const result = await getUserSession(telegramId);
  return result?.username || null;
};

export const getUserIdByUsername = async (username: string): Promise<number | null> => {
    const userQuery = `SELECT id FROM users WHERE username = $1;`;
    const userResult = await db.query(userQuery, [username]);
    return userResult.rows[0]?.id;
}

export const getToken = async (telegramId: number): Promise<string | null> => {
    const sessionQuery = `
      SELECT token FROM user_telegram_sessions WHERE telegram_id = $1 AND is_logged_in = TRUE;
    `;
    const sessionResult = await db.query(sessionQuery, [telegramId]);
    return sessionResult.rows[0].token;
}