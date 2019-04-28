import db from '../models/queries';
import { validateTransaction } from '../helpers/transaction_validation';

class Transactions {
// CREDIT ACCOUNT
  static async creditAccount(req, res) {
    try {
      if (req.user.type === 'user' || req.user.isAdmin) {
        return res.status(403).json({ status: 403, error: 'Only cashier can make transaction' });
      }

      const { error } = validateTransaction(req.body);
      if (error) return res.status(400).json({ status: 400, error: error.details[0].message });

      // console.log(typeof req.params.accountnumber !== 'number');
      if (typeof req.params.accountnumber !== 'number' && isNaN(req.params.accountnumber)) {
        return res.status(400).json({ status: 400, error: 'Account number must be number' });
      }

      const accNber = parseInt(req.params.accountnumber);

      const account = await db.fetchOneAcc(accNber);

      if (!account.rows[0]) return res.status(404).json({ status: 404, error: 'Account not found' });

      if (account.rows[0].status === 'dormant') {
        return res.status(403).json({ status: 403, error: 'The account is not active' });
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
      res.status(500).json({ status: 500, error: 'Server error' });
    }
  }

  // DEBIT ACCOUNT
  static async debitAccount(req, res) {
    try {
      if (req.user.type === 'user' || req.user.isAdmin) {
        return res.status(403).json({ status: 403, error: 'Only cashier can make transaction' });
      }

      const { error } = validateTransaction(req.body);
      if (error) return res.status(400).json({ status: 400, error: error.details[0].message });

      if (typeof req.params.accountnumber !== 'number' && isNaN(req.params.accountnumber)) {
        return res.status(400).json({ status: 400, error: 'Account number must be number' });
      }

      if (req.params.accountnumber.length > 6) {
        return res.status(400).json({ status: 400, error: 'Account number must be 6 digits' });
      }

      const accNber = parseInt(req.params.accountnumber);
      const account = await db.fetchOneAcc(accNber);

      if (!account.rows[0]) return res.status(404).json({ status: 404, error: 'Account not found' });

      if (account.rows[0].status === 'dormant') {
        return res.status(403).json({ status: 403, error: 'The account is not active' });
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
      res.status(500).json({ status: 500, error: 'Server error' });
    }
  }

  // GET ONE TRANSACTION
  static async getOneTrans(req, res) {
    try {
      if (req.user.type !== 'user') {
        return res.status(401).json({ status: 401, error: 'Only user can view his transaction history' });
      }

      const result = await db.fetchTransById(parseInt(req.params.id));
      if (!result.rows[0]) return res.status(404).json({ status: 404, error: 'No transaction found' });
      return res.status(200).json({ status: 200, data: result.rows });
    } catch (error) {
      res.status(500).json({ status: 500, error: 'Server error' });
    }
  }


  // GET TRANSACTIONS FOR ONE ACCOUNT
  static async getTransForAcc(req, res) {
    try {
      if (req.user.type !== 'user') {
        return res.status(401).json({ status: 401, error: 'Only User can view transactions' });
      }

      if (!parseInt(req.params.accountnumber)) {
        return res.status(404).json({ status: 404, error: 'Account does not exists' });
      }

      const accForUser = await db.fetchAccountsByIdForUser(parseInt(req.params.accountnumber), req.user.id);
      if (!accForUser.rows[0]) {
        return res.status(404).json({ status: 404, error: 'Account not found, make sure you are the owner of the account' });
      }

      const result = await db.fetchTransForAcc(accForUser.rows[0].accountnumber);
      if (!result.rows[0]) return res.status(404).json({ status: 404, error: 'There is no transaction on this accounts' });

      return res.status(200).json({ status: 200, data: result.rows });
    } catch (error) {
      res.status(500).json({ status: 500, error: 'Server error' });
    }
  }
}

export default Transactions;
