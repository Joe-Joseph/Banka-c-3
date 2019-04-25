import bcrypt from 'bcryptjs';
import pool from './createTables';

const admin = {
  firstName: 'Emile',
  lastName: 'Joseph',
  email: 'trueadmin@test.com',
  password: bcrypt.hashSync('123456', 10),
  type: 'staff',
  isAdmin: 'true',
};

const Addadmin = 'INSERT INTO users (email, firstname, lastname, password, type, isAdmin) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING';
pool.query(Addadmin, [admin.email, admin.firstName, admin.lastName, admin.password, admin.type, admin.isAdmin])
  .then((result) => {
    console.log('Admin created');
  }).catch((error) => {
    console.log('There was an error');
  });
