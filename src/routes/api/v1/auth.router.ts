import express, { Router } from 'express';
import { apiAuth, userAuth } from '@/middlewares/auth.middleware';
import {
  login,
  register,
  checkToken,
  guestToken,
  logout,
  refreshToken,
} from '@/controllers/v1/auth';
import { asyncHandler } from '@/utils/asyncHandler';
const router: Router = express.Router();

//public
router.get('/check', asyncHandler(checkToken));
router.get('/guest', asyncHandler(guestToken));

//non registered users
router.post('/login', asyncHandler(apiAuth), asyncHandler(login));
router.post('/register', asyncHandler(apiAuth), asyncHandler(register));

//registered users only
router.get('/refreshToken', asyncHandler(userAuth), asyncHandler(refreshToken));
router.post('/logout', asyncHandler(userAuth), asyncHandler(logout));

export default router;
