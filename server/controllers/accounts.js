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

exports.updateAccount = async (req, res) => {
  try {
    const accountNumber = parseInt(req.params.accountnumber);
    const account = await db.fetchOneAcc(accountNumber);
    if (!account.rows[0]) return res.status(404).json({ status: 404, error: 'Account not found' });

    if (req.user.type !== 'staff') {
      return res.status(401).json({
        status: 401,
        error: 'Only Cashier and admin can update an account status',
      });
    }

    await db.updateAccStatus(req.body, accountNumber);
    return res.status(200).json({
      status: 200,
      message: `Your account status is now ${req.body.status}`,
      data: {
        accountNumber,
        status: req.body.status,
      },
    });
  } catch (err) {
    return res.status(500).json({ status: 500, error: err });
  }
};
