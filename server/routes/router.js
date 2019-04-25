import express from 'express';
import signupCtrl from '../controllers/users';
import accountCtrl from '../controllers/accounts';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/auth/signup', signupCtrl.signup);
router.post('/auth/signin', signupCtrl.login);

router.post('/accounts', auth, accountCtrl.createAccount);
router.patch('/accounts/:accountnumber', auth, accountCtrl.updateAccount);

export default router;
