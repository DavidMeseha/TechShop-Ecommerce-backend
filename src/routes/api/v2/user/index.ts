import express from 'express';
import userRouter from './user.router';
import addressesRouter from './addresses.router';
import actionsRouter from './actions.router';
import cartRouter from './cart.router';
import { apiAuth, userAuth } from '@/middlewares/auth.middleware';
import { changeLanguage } from '@/controllers/v1/common';
import { asyncHandler } from '@/utils/asyncHandler';
const router = express.Router();

router.post('/changeLanguage/:lang', apiAuth, asyncHandler(changeLanguage));
router.use('/cart', apiAuth, cartRouter);
router.use('/addresses', userAuth, addressesRouter);
router.use('/actions', userAuth, actionsRouter);
router.use('/', userAuth, userRouter);

export default router;
