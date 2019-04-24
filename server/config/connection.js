import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool;

if (process.env.NODE_ENV === 'DEV') {
  pool = new Pool({
    connectionString: process.env.DATABASE_DEV,
  });
}

if (process.env.NODE_ENV === 'TEST') {
  pool = new Pool({
    connectionString: process.env.DATABASE_TEST,
  });
}

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.DATABASE_prod,
  });
}

export default pool;
