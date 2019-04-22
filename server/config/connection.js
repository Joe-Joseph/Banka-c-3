import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

if (process.env.NODE_ENV === 'DEV') {
  module.exports = new Pool({
    connectionString: process.env.DATABASE_DEV,
  });
}

if (process.env.NODE_ENV === 'TEST') {
  module.exports = new Pool({
    connectionString: process.env.DATABASE_TEST,
  });
}
