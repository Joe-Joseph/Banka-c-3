import pool from './index';

const sql = `CREATE TABLE IF NOT EXISTS
    users(
        id SERIAL PRIMARY KEY,
        email VARCHAR(50) UNIQUE NOT NULL,
        firstname VARCHAR(40) NOT NULL,
        lastname VARCHAR(40) NOT NULL,
        password VARCHAR(250) NOT NULL,
        type VARCHAR(30),
        isAdmin BOOLEAN
    );

    CREATE TABLE IF NOT EXISTS
    accounts(
        id SERIAL,
        accountnumber INTEGER PRIMARY KEY,
        createdon TIMESTAMP,
        owner INTEGER NOT NULL,
        type VARCHAR(30) NOT NULL,
        status VARCHAR(30) NOT NULL,
        balance NUMERIC NOT NULL,
        FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS
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

pool.query(sql).then(() => {
  console.log('Tables created successfully');
  // pool.end();
}).catch((err) => {
  console.log(err);
  process.exit(0);
});


export default pool;
