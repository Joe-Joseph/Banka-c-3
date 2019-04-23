import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_DEV,
});

pool.on('connect', () => {
  console.log('connected to the db');
});

export const createTables = () => {
  const users = `CREATE TABLE IF NOT EXISTS
    users(
        id SERIAL PRIMARY KEY,
        email VARCHAR(50) UNIQUE NOT NULL,
        firstname VARCHAR(40) NOT NULL,
        lastname VARCHAR(40) NOT NULL,
        password VARCHAR(250) NOT NULL,
        type VARCHAR(30),
        isAdmin BOOLEAN
    )`;

  const accounts = `CREATE TABLE IF NOT EXISTS
    accounts(
        id SERIAL,
        accountnumber INTEGER PRIMARY KEY,
        createdon TIMESTAMP,
        owner INTEGER NOT NULL,
        type VARCHAR(30) NOT NULL,
        status VARCHAR(30) NOT NULL,
        balance NUMERIC NOT NULL,
        FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE
    )`;

  const transactions = `CREATE TABLE IF NOT EXISTS
    transactions(
        id SERIAL PRIMARY KEY,
        createdon TIMESTAMP,
        type VARCHAR(30) NOT NULL,
        cashier INTEGER NOT NULL,
        amount NUMERIC NOT NULL,
        oldbalance NUMERIC NOT NULL,
        newbalance NUMERIC NOT NULL,
        accountnumber INTEGER REFERENCES accounts(accountnumber)
    )`;

  const sql = `${users}; ${accounts}; ${transactions}`;
  pool.query(sql).then(() => {
    console.log('Tables created successfully');
    pool.end();
  }).catch((err) => {
    console.log(err);
    process.exit(0);
  });
};

export const deleteTables = () => {
  const users = 'DROP TABLE IF EXISTS users CASCADE';
  const accounts = 'DROP TABLE IF EXISTS accounts CASCADE';
  const transactions = 'DROP TABLE IF EXISTS transactions';

  const deletesql = `${users}; ${accounts}; ${transactions}`;
  pool.query(deletesql).then(() => {
    console.log('Deleted tables successfully');
    pool.end();
  }).catch((err) => {
    console.log(err);
    process.exit(0);
  });
};

require('make-runnable');
