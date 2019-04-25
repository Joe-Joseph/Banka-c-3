import bcrypt from 'bcryptjs';
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
}

export default new Dbquery();
