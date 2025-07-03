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

const router: Router = express.Router();

//Public
router.get('/guest', asyncHandler(guestToken));
router.get('/check', asyncHandler(checkToken));

// api Protected
router.get('/vendor', apiAuth, asyncHandler(checkVendor));
router.post('/login', apiAuth, asyncHandler(login));
router.post('/register', apiAuth, asyncHandler(register));

// User Protected
router.get('/refreshToken', userAuth, asyncHandler(refreshToken));
router.post('/logout', userAuth, asyncHandler(logout));

export default router;
