import db from '../models/queries';
import { validateTransaction } from '../helpers/transaction_validation';

// CREDIT ACCOUNT
exports.creditAccount = async (req, res) => {
  try {
    const accNber = parseInt(req.params.accountnumber);
    const account = await db.fetchOneAcc(accNber);

    if (!account.rows[0]) return res.status(404).json({ status: 404, error: 'Account not found' });

    const { error } = validateTransaction(req.body);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].message });

    if (req.user.type === 'user' || req.user.isAdmin) {
      return res.status(401).json({ status: 401, error: 'Only cashier can make transaction' });
    }

    const accountNumber = parseInt(account.rows[0].accountnumber);
    const oldBalance = parseFloat(account.rows[0].balance);
    const amount = parseFloat(req.body.amount);
    const balance = parseFloat(oldBalance + amount);

    const transa = await db.transation(req.body, 'credit', accountNumber, req.user, oldBalance, balance);
    await db.updateAcc(balance, accountNumber);

    return res.status(201).json({
      status: 201,
      data: {
        transactionId: transa.rows[0].id,
        accountNumber: transa.rows[0].accountnumber,
        amount: transa.rows[0].amount,
        cashier: transa.rows[0].cashier,
        transactionType: transa.rows[0].type,
        accountBalance: transa.rows[0].newbalance,
      },
    });
  } catch (error) {
    res.status(500).json({ status: 500, error });
  }
};

// DEBIT ACCOUNT
exports.debitAccount = async (req, res) => {
  try {
    const accNber = parseInt(req.params.accountnumber);
    const account = await db.fetchOneAcc(accNber);

    if (!account.rows[0]) return res.status(404).json({ status: 404, error: 'Account not found' });

    const { error } = validateTransaction(req.body);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].message });

    if (req.user.type === 'user' || req.user.isAdmin) {
      return res.status(401).json({ status: 401, error: 'Only cashier can make transaction' });
    }

    if (account.rows[0].balance < req.body.amount) {
      return res.status(400).json({ status: 400, error: 'Insuficient balance' });
    }

    const accountNumber = parseInt(account.rows[0].accountnumber);
    const oldBalance = parseFloat(account.rows[0].balance);
    const amount = parseFloat(req.body.amount);
    const balance = parseFloat(oldBalance - amount);

    const transa = await db.transation(req.body, 'debit', accountNumber, req.user, oldBalance, balance);
    await db.updateAcc(balance, accountNumber);

    return res.status(201).json({
      status: 201,
      data: {
        transactionId: transa.rows[0].id,
        accountNumber: transa.rows[0].accountnumber,
        amount: transa.rows[0].amount,
        cashier: transa.rows[0].cashier,
        transactionType: transa.rows[0].type,
        accountBalance: transa.rows[0].newbalance,
      },
    });
  } catch (error) {
    res.status(500).json({ status: 500, error });
  }
};

// GET ALL TRANSACTIONS
exports.getAllTrans = async (req, res) => {
  if (req.user.type !== 'user') {
    return res.status(401).json({ status: 401, error: 'Only user can view his transaction history' });
  }

  const result = await db.fetchAllTrans();
  if (!result) return res.status(404).json({ status: 404, error: 'No transaction found' });
  return res.status(200).json({ status: 200, data: result.rows });
};
