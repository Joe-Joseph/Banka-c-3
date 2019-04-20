import express from 'express';
import signupCtrl from '../controllers/users';
import accountCtrl from '../controllers/accounts';
import transactionCtrl from '../controllers/transactions';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/auth/signup', signupCtrl.signup);
router.post('/auth/signin', signupCtrl.login);

router.post('/accounts', auth, accountCtrl.createAccount);
router.patch('/accounts/:accountnumber', auth, accountCtrl.updateAccount);
router.delete('/accounts/:accountnumber', auth, accountCtrl.deleteAccount);

router.post('/transactions/:accountnumber/credit', auth, transactionCtrl.creditAccount);
router.post('/transactions/:accountnumber/debit', auth, transactionCtrl.debitAccount);
router.get('/accounts/:accountnumber/transactions', auth, transactionCtrl.getAllTrans);

export default router;
