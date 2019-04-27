import express from 'express';
import Users from '../controllers/users';
import Accounts from '../controllers/accounts';
import Transactions from '../controllers/transactions';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/auth/signup', Users.signup);
router.post('/auth/user', auth, Users.signupCashier);
router.post('/auth/signin', Users.login);

router.post('/accounts/', auth, Accounts.createAccount);
router.patch('/accounts/:accountnumber/', auth, Accounts.updateAccount);
router.delete('/accounts/:accountnumber', auth, Accounts.deleteAccount);
router.get('/account/:accountnumber', auth, Accounts.getOneAccount);
router.get('/accounts', auth, Accounts.getAllAccounts);
router.get('/user/:email/accounts', auth, Accounts.getAccountsForOneUser);
router.get('/account', auth, Accounts.getActiveAccounts);

router.post('/transactions/:accountnumber/credit', auth, Transactions.creditAccount);
router.post('/transactions/:accountnumber/debit', auth, Transactions.debitAccount);
router.get('/transactions/:id', auth, Transactions.getOneTrans);
router.get('/accounts/:accountnumber/transactions', auth, Transactions.getTransForAcc);

export default router;
