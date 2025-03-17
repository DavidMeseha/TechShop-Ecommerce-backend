import express, { Router } from 'express';
import { apiAuthMiddleware, userAuthMiddleware } from '../middlewares/auth.middleware';
import { login, register, checkToken, guestToken, logout, refreshToken } from '../controllers/auth';
const router: Router = express.Router();

router.get('/check', checkToken);
router.get('/guest', guestToken);
router.post('/login', apiAuthMiddleware, login);
router.post('/logout', userAuthMiddleware, logout);
router.post('/register', apiAuthMiddleware, register);
router.get('/refreshToken', userAuthMiddleware, refreshToken);

export default router;
