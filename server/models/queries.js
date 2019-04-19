import bcrypt from 'bcryptjs';
import moment from 'moment';
import pool from '../config/connection';

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
}

export default new Dbquery();
