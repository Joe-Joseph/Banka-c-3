import jwt from 'jsonwebtoken';
import keys from '../config/connection';

const authentication = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || header === '') {
      return res.status(400).json({ status: 400, error: 'Authentication Failed' });
    }

    const decoded = jwt.verify(header, keys.secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ status: 401, error: 'Invalid token' });
  }
};

export default authentication;
