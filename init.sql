CREATE TABLE IF NOT EXISTS user_telegram_sessions (
    telegram_id BIGINT PRIMARY KEY,
    username VARCHAR(30),
    is_logged_in BOOLEAN DEFAULT FALSE,
    token TEXT
);

-- Создание таблицы users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    privilege_level SMALLINT NOT NULL DEFAULT 1
);

-- Создание таблицы rooms
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    number INTEGER NOT NULL,
    description TEXT,
    capability INTEGER NOT NULL,
    floor INTEGER NOT NULL,
    is_open BOOLEAN NOT NULL DEFAULT TRUE,
    photo TEXT,
    UNIQUE (floor, number)
);

-- Создание таблицы bookings
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    room_id INTEGER NOT NULL,
    start TIMESTAMP NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    UNIQUE (room_id, start)
);

CREATE TABLE IF NOT EXISTS bookings_logs (
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

INSERT INTO users (username, email, password_hash, privilege_level)
VALUES ('Admin', 'admin@mail.ru', '$2a$10$2WW/I4J6nSy5sCxOUbIZVeQfA5gI49D1wu.rHPWNMa.VNunW69EGq', 5);

INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (1, 'Room 1 on Floor 1', 20, 1, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (2, 'Room 2 on Floor 1', 30, 1, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (3, 'Room 3 on Floor 1', 40, 1, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (4, 'Room 4 on Floor 1', 20, 1, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (5, 'Room 5 on Floor 1', 30, 1, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (6, 'Room 6 on Floor 1', 40, 1, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (7, 'Room 7 on Floor 1', 20, 1, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (8, 'Room 8 on Floor 1', 30, 1, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (9, 'Room 9 on Floor 1', 40, 1, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (10, 'Room 10 on Floor 1', 20, 1, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (11, 'Room 11 on Floor 1', 30, 1, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (12, 'Room 12 on Floor 1', 40, 1, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (13, 'Room 13 on Floor 1', 20, 1, true, NULL) ON CONFLICT DO NOTHING;

INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (1, 'Room 1 on Floor 2', 30, 2, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (2, 'Room 2 on Floor 2', 20, 2, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (3, 'Room 3 on Floor 2', 40, 2, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (4, 'Room 4 on Floor 2', 20, 2, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (5, 'Room 5 on Floor 2', 30, 2, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (6, 'Room 6 on Floor 2', 40, 2, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (7, 'Room 7 on Floor 2', 20, 2, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (8, 'Room 8 on Floor 2', 30, 2, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (9, 'Room 9 on Floor 2', 40, 2, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (10, 'Room 10 on Floor 2', 20, 2, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (11, 'Room 11 on Floor 2', 30, 2, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (12, 'Room 12 on Floor 2', 40, 2, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (13, 'Room 13 on Floor 2', 20, 2, true, NULL) ON CONFLICT DO NOTHING;

INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (1, 'Room 1 on Floor 3', 40, 3, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (2, 'Room 2 on Floor 3', 20, 3, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (3, 'Room 3 on Floor 3', 30, 3, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (4, 'Room 4 on Floor 3', 40, 3, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (5, 'Room 5 on Floor 3', 20, 3, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (6, 'Room 6 on Floor 3', 30, 3, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (7, 'Room 7 on Floor 3', 40, 3, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (8, 'Room 8 on Floor 3', 20, 3, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (9, 'Room 9 on Floor 3', 30, 3, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (10, 'Room 10 on Floor 3', 40, 3, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (11, 'Room 11 on Floor 3', 20, 3, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (12, 'Room 12 on Floor 3', 30, 3, true, NULL) ON CONFLICT DO NOTHING;
INSERT INTO rooms (number, description, capability, floor, is_open, photo) VALUES (13, 'Room 13 on Floor 3', 40, 3, true, NULL) ON CONFLICT DO NOTHING;