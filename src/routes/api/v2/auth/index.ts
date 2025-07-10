import express, { Router } from 'express';
import { apiAuth, userAuth } from '@/middlewares/auth.middleware';
import { asyncHandler } from '@/utils/asyncHandler';
import {
  checkToken,
  checkVendor,
  guestToken,
  login,
  logout,
  refreshToken,
  register,
} from '@/controllers/v1/auth';
import rateLimit from 'express-rate-limit';

const router: Router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many attempts, please try again later.' },
});

//Public
router.get('/guest', asyncHandler(guestToken));
router.get('/check', asyncHandler(checkToken));

// api Protected
router.get('/vendor', authLimiter, apiAuth, asyncHandler(checkVendor));
router.post('/login', authLimiter, apiAuth, asyncHandler(login));
router.post('/register', authLimiter, apiAuth, asyncHandler(register));

// User Protected
router.get('/refreshToken', userAuth, asyncHandler(refreshToken));
router.post('/logout', userAuth, asyncHandler(logout));

export default router;
