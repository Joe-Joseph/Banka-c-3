import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import keys from '../config/connection';
import db from '../models/queries';
import { validateUser, validateUserLogin } from '../helpers/user_validation';

class Users {
  // SIGNUP
  static async signup(req, res) {
    try {
      const { error } = validateUser(req.body);
      if (error) return res.status(400).json({ status: 400, error: error.details[0].message });

      let user = await db.fetchOneUser(req.body);
      if (user.rows[0]) return res.status(400).json({ status: 400, error: 'Email arleady registered' });

      user = await db.signup(req.body, 'user', 'false');
      const payload = {
        id: user.rows[0].id,
        firstname: user.rows[0].firstname,
        lastname: user.rows[0].lastname,
        email: user.rows[0].email,
        type: user.rows[0].type,
      };
      const token = jwt.sign(payload, keys.secretKey, { expiresIn: '24h' });

      return res.header('Authorization', token).status(201).json({
        status: 201,
        data: {
          token,
          id: payload.id,
          firstname: payload.firstname,
          lastname: payload.lastname,
          email: payload.email,
          type: payload.type,
          isAdmin: payload.isAdmin,
        },
      });
    } catch (error) {
      res.status(500).json({ status: 500, error: 'Server Error' });
    }
  }

  // SIGNIN
  static async login(req, res) {
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
          type: payload.type,
          isAdmin: payload.isAdmin,
        });
      }
      return res.status(404).json({ status: 404, error: 'Email and password not found' });
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Server Error' });
    }
  }

  static async signupCashier(req, res) {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ status: 404, error: 'Only Admin can create staff account' });
      }
      const { error } = validateUser(req.body);
      if (error) return res.status(400).json({ status: 400, error: error.details[0].message });

      let user = await db.fetchOneUser(req.body);
      if (user.rows[0]) return res.status(400).json({ status: 400, error: 'Email arleady registered' });

      user = await db.signup(req.body, 'staff', 'false');
      const payload = {
        id: user.rows[0].id,
        firstname: user.rows[0].firstname,
        lastname: user.rows[0].lastname,
        email: user.rows[0].email,
        type: user.rows[0].type,
      };
      const token = jwt.sign(payload, keys.secretKey, { expiresIn: '24h' });

      return res.header('Authorization', token).status(201).json({
        status: 201,
        data: {
          token,
          id: payload.id,
          firstname: payload.firstname,
          lastname: payload.lastname,
          email: payload.email,
          type: payload.type,
          isAdmin: payload.isAdmin,
        },
      });
    } catch (error) {
      res.status(500).json({ status: 500, error: 'Server Error' });
    }
  }
}

export default Users;
