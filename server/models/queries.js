import bcrypt from 'bcryptjs';
import moment from 'moment';
import pool from './createTables';

class Dbquery {
  // FETCH ALL FROM USERS
  async fetchOneUser(data) {
    const selectAll = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(selectAll, [data.email.toLowerCase()]);
    return result;
  }

  // SAVE USER INTO USERS
  async signup(data) {
    const newUser = {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email.toLowerCase(),
      password: bcrypt.hashSync(data.password, 10),
      type: data.type,
      isAdmin: data.isAdmin,
    };
    const insertUserQuery = 'INSERT INTO users (email, firstname, lastname, password, type, isAdmin) VALUES($1,$2,$3,$4,$5,$6) RETURNING *';
    const result = await pool.query(insertUserQuery, [newUser.email, newUser.firstname, newUser.lastname, newUser.password, newUser.type, newUser.isAdmin]);
    return result;
  }

  // CREATE A BANK ACCOUNT
  async createAccount(data, payload) {
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    const userId = payload.id;

    const account = {
      accountNumber: parseInt(`${randomNumber}${userId}`, 10),
      createdOn: moment().format('LL'),
      owner: userId,
      type: data.type,
      status: 'Active',
      balance: 0,
    };
    const createAccQuery = 'INSERT INTO accounts (accountnumber, createdon, owner, type, status, balance) VALUES($1,$2,$3,$4,$5,$6) RETURNING *';
    const result = pool.query(createAccQuery, [account.accountNumber, account.createdOn, account.owner, account.type, account.status, account.balance]);
    return result;
  }

  // FIND ONE ACCOUNT NUMBER
  async fetchOneAcc(accNumber) {
    const queryText = 'SELECT * FROM accounts WHERE accountnumber = $1';
    const response = await pool.query(queryText, [accNumber]);
    return response;
  }

  // UPDATE ACCOUNT STATUS
  async updateAccStatus(data, accNumber) {
    const updateStatusQuery = 'UPDATE accounts SET status = $1 WHERE accountnumber = $2';
    const result = await pool.query(updateStatusQuery, [data.status, accNumber]);
    return result;
  }

  // DELETE SPECIFIC ACCOUNT
  async deleteAcc(accNumber) {
    const deleteAccQuery = 'DELETE FROM accounts WHERE accountnumber = $1';
    const result = await pool.query(deleteAccQuery, [accNumber]);
    return result;
  }

  // DELETE A TRANSACTION
  async deleteTrans(accNumber) {
    const deleteAccQuery = 'DELETE FROM transactions WHERE accountnumber = $1';
    const result = await pool.query(deleteAccQuery, [accNumber]);
    return result;
  }

  // MAKE TRANSACTION
  async transation(data, transaType, accountNumber, userId, oldBalance, newbalance) {
    const creditTransaction = {
      createdon: moment().format('LL'),
      type: transaType,
      accountnumber: accountNumber,
      cashier: userId.id,
      amount: data.amount,
      oldbalance: oldBalance,
      newbalance,
    };
    const creditQuery = 'INSERT INTO transactions (createdon, type, accountnumber, cashier, amount, oldbalance, newbalance) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *';
    const result = await pool.query(creditQuery, [creditTransaction.createdon, creditTransaction.type, creditTransaction.accountnumber, creditTransaction.cashier, creditTransaction.amount, creditTransaction.oldbalance, creditTransaction.newbalance]);
    return result;
  }

  // UPDATE ACCOUNT BALANCE
  async updateAcc(data, accountNumber) {
    const updateBalanceQuery = 'UPDATE accounts SET balance = $1 WHERE accountnumber = $2';
    const result = await pool.query(updateBalanceQuery, [data, accountNumber]);
    return result;
  }

  // GET TRANSACTION BY ID
  async fetchTransById(transId) {
    const selectAllTrans = 'SELECT * FROM transactions WHERE id = $1';
    const result = await pool.query(selectAllTrans, [transId]);
    return result;
  }

  // GET TRANSACTIONS FOR ONE ACCOUNT
  async fetchTransForAcc(accNumber) {
    const selectTransForAcc = 'SELECT * FROM transactions WHERE accountnumber = $1';
    const result = await pool.query(selectTransForAcc, [accNumber]);
    return result;
  }

  // FIND ONE ACCOUNT DETAILS FOR A LOGGED IN USER
  async fetchOneAccDetails(accNumber, payload) {
    const queryText = 'SELECT * FROM accounts WHERE accountnumber = $1 AND owner = $2';
    const response = await pool.query(queryText, [accNumber, payload.id]);
    return response;
  }

  // GET ALL ACCOUNTS
  async fetchAll() {
    const selectAll = 'SELECT accounts.createdon, accounts.accountnumber, accounts.type, accounts.status, accounts.balance, users.email FROM accounts, users';
    const result = await pool.query(selectAll);
    return result;
  }

  // GET ACCOUNTS FOR A SPECIFIC USER
  async fetchAccountsForUser(email) {
    const selectAllAccounts = 'SELECT * FROM accounts INNER JOIN users ON accounts.owner=users.id WHERE users.email=$1';
    const result = pool.query(selectAllAccounts, [email]);
    return result;
  }

  // VIEW ACTIVE ACCOUNT
  async fetchAccountsByStatus(data) {
    const selectActiveAccounts = 'SELECT * FROM accounts INNER JOIN users ON accounts.owner=users.id WHERE accounts.status=$1';
    const result = pool.query(selectActiveAccounts, [data.status]);
    return result;
  }
}

export default new Dbquery();
