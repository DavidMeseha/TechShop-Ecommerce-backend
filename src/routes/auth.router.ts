import express, { Router } from 'express';
import { apiAuth, userAuth } from '../middlewares/auth.middleware';
import { login, register, checkToken, guestToken, logout, refreshToken } from '../controllers/auth';
const router: Router = express.Router();

//public
router.get('/check', checkToken);
router.get('/guest', guestToken);

//non registered users
router.post('/login', apiAuth, login);
router.post('/register', apiAuth, register);

//registered users only
router.get('/refreshToken', userAuth, refreshToken);
router.post('/logout', userAuth, logout);

export default router;
