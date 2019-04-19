import express from 'express';
import signupCtrl from '../controllers/users';

const router = express.Router();

router.post('/auth/signup', signupCtrl.signup);
router.post('/auth/signin', signupCtrl.login);

export default router;
