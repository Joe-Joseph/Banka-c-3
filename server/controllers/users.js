import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import keys from '../config/connection';
import db from '../models/queries';
import { validateUser, validateUserLogin } from '../helpers/user_validation';

// SIGNUP
exports.signup = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ status: 400, error: error.details[0].message });

  let user = await db.fetchOneUser(req.body);
  if (user.rows[0]) return res.status(400).json({ status: 400, error: 'Email arleady registered' });

  user = await db.signup(req.body);
  const payload = {
    id: user.rows[0].id,
    firstname: user.rows[0].firstname,
    lastname: user.rows[0].lastname,
    email: user.rows[0].email,
    type: user.rows[0].type,
    isAdmin: user.rows[0].isadmin,
  };
  const token = jwt.sign(payload, keys.secretKey, { expiresIn: '24h' });

  return res.status(201).json({
    status: 201,
    data: {
      token,
      id: payload.id,
      firstname: payload.firstname,
      lastname: payload.lastname,
      email: payload.email,
    },
  });
};

// SIGNIN
exports.login = async (req, res) => {
  try {
    const { error } = validateUserLogin(req.body);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].message });

    const user = await db.fetchOneUser(req.body);
    if (!user.rows[0]) {
      return res.status(404).json({ status: 404, error: 'Email and password not found' });
    }

    const compare = bcrypt.compareSync(req.body.password, user.rows[0].password);
    if (compare) {
      const payload = {
        id: user.rows[0].id,
        firstname: user.rows[0].firstname,
        lastname: user.rows[0].lastname,
        email: user.rows[0].email,
        type: user.rows[0].type,
        isAdmin: user.rows[0].isadmin,
      };
      const token = jwt.sign(payload, keys.secretKey, { expiresIn: '24h' });
      return res.status(200).json({
        status: 200,
        data: token,
        id: payload.id,
        firstName: payload.firstname,
        lastName: payload.lastname,
        email: payload.email,
      });
    }
  } catch (err) {
    return res.status(500).json({ status: 500, error: err });
  }
};
