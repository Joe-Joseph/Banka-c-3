import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import pool from './createTables';

dotenv.config();
// console.log(process.env.email, process.env.password);
const admin = {
  firstName: 'Nkurunziza',
  lastName: 'Joseph',
  email: process.env.email,
  password: bcrypt.hashSync(JSON.stringify(process.env.password), 10),
  type: 'staff',
  isAdmin: 'true',
};
// console.log(admin.email, admin.password);
const Addadmin = 'INSERT INTO users (email, firstname, lastname, password, type, isAdmin) VALUES($1,$2,$3,$4,$5,$6)';
pool.query(Addadmin, [admin.email, admin.firstName, admin.lastName, admin.password, admin.type, admin.isAdmin])
  .then((result) => {
    console.log('Admin created');
  }).catch((error) => {
    console.log(error);
  });
