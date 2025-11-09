-- Создание таблицы users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    privilege_level SMALLINT NOT NULL DEFAULT 1
);

-- Создание таблицы rooms
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    number INTEGER NOT NULL,
    description TEXT,
    capability INTEGER NOT NULL,
    floor INTEGER NOT NULL,
    is_open BOOLEAN NOT NULL DEFAULT TRUE,
    photo TEXT
    UNIQUE (floor, number)
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

CREATE TABLE bookings_logs (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL,
    operation_type TEXT NOT NULL,
    actioner_id INTEGER NOT NULL,
    previous_user_id INTEGER,
    new_user_id INTEGER,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (actioner_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (previous_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (new_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);