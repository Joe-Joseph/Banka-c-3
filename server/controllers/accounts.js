import { validateAccount, validateAccountStatus } from '../helpers/account_validation';
import db from '../models/queries';

class Accounts {
  // CREATE BANK ACCOUNT
  static async createAccount(req, res) {
    const { error } = validateAccount(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.details[0].message,
      });
    }
    try {
      const acc = await db.createAccount(req.body, req.user);
      return res.status(201).json({
        status: 201,
        message: `Bank account successfully created with ${acc.rows[0].accountnumber} as your account number`,
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
  }

  // UPDATE ACCOUNT STATUS
  static async updateAccount(req, res) {
    const { error } = validateAccountStatus(req.body);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].message });
    try {
      if (req.user.type === 'user') {
        // console.log(req.user.type);
        return res.status(403).json({
          status: 403,
          error: 'Only Cashier and admin can update an account status',
        });
      }

      if (typeof req.params.accountnumber !== 'number' && isNaN(req.params.accountnumber)) {
        return res.status(400).json({ status: 400, error: 'Account number must be number' });
      }

      const accountNumber = parseInt(req.params.accountnumber);
      const account = await db.fetchOneAcc(accountNumber);
      if (!account.rows[0]) return res.status(404).json({ status: 404, error: 'Account not found' });

      if (account.rows[0].status === req.body.status) {
        return res.status(409).json({
          status: 409,
          error: `This account status is already ${req.body.status}`,
        });
      }

      await db.updateAccStatus(req.body, accountNumber);
      return res.status(200).json({
        status: 200,
        message: `This account status is now ${req.body.status}`,
        data: {
          accountNumber,
          status: req.body.status,
        },
      });
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Server Error' });
    }
  }

  // DELETE SPECIFIC ACCOUNT
  static async deleteAccount(req, res) {
    try {
      if (req.user.type !== 'staff') {
        console.log(req.user.type);
        return res.status(403).json({
          status: 403,
          error: 'Only Cashier and admin can delete an account',
        });
      }

      if (typeof req.params.accountnumber !== 'number' && isNaN(req.params.accountnumber)) {
        return res.status(400).json({ status: 400, error: 'Account number must be number' });
      }

      const accountNumber = parseInt(req.params.accountnumber);
      const account = await db.fetchOneAcc(accountNumber);
      if (!account.rows[0]) return res.status(404).json({ status: 404, error: 'Account not found' });

      if (account.rows[0].balance > 0) {
        return res.status(403).json({ status: 403, error: 'Can not delete account with amount on balance' });
      }

      await db.deleteTrans(accountNumber);
      await db.deleteAcc(accountNumber);
      return res.status(200).json({ status: 200, message: 'account successfully deleted' });
    } catch (error) {
      res.status(500).json({ status: 500, error: 'Server Error' });
    }
  }

  // GET SPECIFIC ACCOUNT DETAILS
  static async getOneAccount(req, res) {
    try {
      if (typeof req.params.accountnumber !== 'number' && isNaN(req.params.accountnumber)) {
        return res.status(400).json({ status: 400, error: 'Account number must be number' });
      }

      const result = await db.fetchOneAccDetails(parseInt(req.params.accountnumber));
      if (!result.rows[0]) return res.status(404).json({ status: 404, error: 'Account not found' });

      if (req.user.id !== result.rows[0].owner) {
        return res.status(403).json({
          status: 403,
          error: 'You are not the owner of the account',
        });
      }
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
    } catch (error) {
      res.status(500).json({ status: 500, error: 'Server Error' });
    }
  }

  // GET ALL ACCOUNTS
  static async getAllAccounts(req, res) {
    // console.log(req.user.type);
    if (req.user.type === 'user') return res.status(403).json({ status: 403, error: 'Only staff can view list of bank accounts' });

    const result = await db.fetchAll();
    if (!result.rows[0]) return res.status(404).json({ status: 404, error: 'No account' });

    return res.status(200).json({
      status: 200,
      data: result.rows,
    });
  }

  // VIEW ACCOUNTS OWNED BY SPECIFIC USER
  static async getAccountsForOneUser(req, res) {
    const email = req.params.email.toLowerCase().trim();
    const user = await db.fetchOneUser(req.params);

    if (!user.rows[0]) {
      return res.status(404).json({
        status: 404,
        error: 'User with the given email does not exists',
      });
    }

    const userAccounts = await db.fetchAccountsForUser(email);

    if (!userAccounts.rows[0]) return res.status(404).json({ status: 404, error: 'Account not found' });

    if (req.user.type !== 'staff' && req.user.id !== userAccounts.rows[0].owner) {
      return res.status(403).json({
        status: 403,
        error: 'You are not the owner of the account',
      });
    }

    const foundAccounts = [];
    userAccounts.rows.forEach((row) => {
      const account = {
        createdOn: row.createdon,
        accountNumber: row.accountnumber,
        type: row.type,
        status: row.status,
        balance: row.balance,
      };
      foundAccounts.push(account);
    });

    return res.status(200).json({ status: 200, data: foundAccounts });
  }

  // GET ALL ACTIVE ACCOUNTS
  static async getActiveAccounts(req, res) {
    if (req.user.type === 'user') {
      return res.status(403).json({
        status: 403,
        error: 'Only Admin and cashier can view accounts',
      });
    }

    const ActiveAccounts = await db.fetchAccountsByStatus(req.query);
    if (!ActiveAccounts.rows[0]) {
      return res.status(404).json({
        status: 404,
        error: 'No account found',
      });
    }

    const foundActiveAccounts = [];
    ActiveAccounts.rows.forEach((row) => {
      const active = {
        createdOn: row.createdon,
        accountNumber: row.accountnumber,
        ownerEmail: row.email,
        type: row.type,
        status: row.status,
        balance: row.balance,
      };
      foundActiveAccounts.push(active);
    });
    return res.status(200).json({
      status: 200,
      data: foundActiveAccounts,
    });
  }
}

export default Accounts;
