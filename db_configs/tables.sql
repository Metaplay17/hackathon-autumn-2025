-- Создание таблицы users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    privilege_level SMALLINT NOT NULL DEFAULT 1,
    telegram_id BIGINT NOT NULL UNIQUE -- Если он обязателен при регистрации
);

-- Создание таблицы rooms
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    number INTEGER NOT NULL,
    capability INTEGER NOT NULL,
    floor INTEGER NOT NULL,
    is_open BOOLEAN NOT NULL DEFAULT TRUE
);

-- Создание таблицы bookings
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    room_id INTEGER NOT NULL,
    start TIMESTAMP NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    UNIQUE (room_id, start)
);