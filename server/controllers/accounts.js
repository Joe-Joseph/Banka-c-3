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

// UPDATE ACCOUNT STATUS
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

// DELETE SPECIFIC ACCOUNT
exports.deleteAccount = async (req, res) => {
  try {
    const accountNumber = parseInt(req.params.accountnumber);
    const account = await db.fetchOneAcc(accountNumber);
    if (!account.rows[0]) return res.status(404).json({ status: 404, error: 'Account not found' });

    if (req.user.type !== 'staff') {
      return res.status(401).json({ status: 401, error: 'Only Cashier and admin can delete an account' });
    }

    await db.deleteTrans(accountNumber);
    await db.deleteAcc(accountNumber);
    return res.status(200).json({ status: 200, message: 'account successfully deleted' });
  } catch (error) {
    res.status(500).json({ status: 500, error });
  }
};

// GET SPECIFIC ACCOUNT DETAILS
exports.getOneAccount = async (req, res) => {
  const result = await db.fetchOneAccDetails(parseInt(req.params.accountnumber), req.user);
  if (!result) return res.status(404).json({ status: 404, error: 'No account' });
  return res.status(200).json({
    status: 200,
    data: {
      createdOn: result.rows[0].createdon,
      accountNumber: result.rows[0].accountnumber,
      ownerEmail: req.user.email,
      type: result.rows[0].type,
      status: result.rows[0].status,
      balance: result.rows[0].balance,
    },
  });
};

// GET ALL ACCOUNTS
exports.getAllAccounts = async (req, res) => {
  if (req.user.type === 'user') return res.status(401).json({ status: 401, error: 'Only staff can view list of bank accounts' });

  const result = await db.fetchAll();
  if (!result) return res.status(404).json({ status: 404, error: 'No account' });

  const allAccounts = [];
  for (let i = 0; i < result.rows.length; i++) {
    const foundAccounts = {
      createdOn: result.rows[i].createdon,
      accountNumber: result.rows[i].accountnumber,
      ownerEmail: result.rows[i].email,
      type: result.rows[i].type,
      status: result.rows[i].status,
      balance: result.rows[i].balance,
    };
    allAccounts.push(foundAccounts);
  }
  return res.status(200).json({ status: 200, data: allAccounts });
};
