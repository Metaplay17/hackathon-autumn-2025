import { Pool } from 'pg';

export const db = new Pool({
  user: 'postgres',
  password: '1234',
  host: 'localhost',
  port: 5432,
  database: 'book_room',
});