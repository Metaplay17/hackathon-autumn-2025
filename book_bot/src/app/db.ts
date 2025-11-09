import { Pool } from 'pg';

const DB_NAME = 'book_room';
const DB_USERNAME = 'postgres';
const DB_PASSWORD = '1234';

export const db = new Pool({
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: 'db',
  port: 5432,
  database: DB_NAME,
});