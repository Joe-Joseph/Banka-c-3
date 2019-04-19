import { validateAccount } from '../helpers/account_validation';
import db from '../models/queries';

exports.createAccount = async (req, res) => {
  const { error } = validateAccount(req.body);
  if (error) return res.status(400).json({ status: 400, error: error.details[0].message });
  try {
    const acc = await db.createAccount(req.body, req.user);
    return res.status(201).json({
      status: 201,
      message: 'Bank account created successfully',
      data: {
        accountNumber: acc.rows[0].accountnumber,
        firstName: req.user.firstname,
        lastName: req.user.lastname,
        email: req.user.email,
        type: acc.rows[0].type,
        OpeningBalance: acc.rows[0].balance,
      },
    });
  } catch (err) {
    return res.status(500).json({ status: 500, error: err });
  }
};
