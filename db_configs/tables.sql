CREATE TABLE user_telegram_sessions (
    telegram_id BIGINT PRIMARY KEY,
    username VARCHAR(30),
    is_logged_in BOOLEAN DEFAULT FALSE, 
    token TEXT
);-- TABLES