import { Pool } from 'pg';

// Загрузка переменных из .env (если используете dotenv)
import dotenv from 'dotenv';
dotenv.config();

// Используем переменные из окружения, с fallback на значения по умолчанию
const DB_NAME = process.env.DB_NAME || 'booking';
const DB_USERNAME = process.env.DB_USERNAME || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'password1A';

export const db = new Pool({
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: 'db',
  port: 5432,
  database: DB_NAME,
});