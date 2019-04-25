import jwt from 'jsonwebtoken';
import db from '../models/queries';
import { validateUser, validateUserLogin } from '../helpers/user_validation';

// SIGNUP
exports.signup = async (req, res) => {
  try {
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
      isAdmin: user.rows[0].isAdmin,
    };
    const token = jwt.sign(payload, process.env.secretKey, { expiresIn: '24h' });

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
  } catch (err) {
    res.status(500).json({ status: 500, error: err });
  }
};
