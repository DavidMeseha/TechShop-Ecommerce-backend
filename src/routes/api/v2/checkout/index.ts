import express from 'express';
import checkoutRouter from './checkout.router';
import { apiAuth, userAuth } from '@/middlewares/auth.middleware';
import { asyncHandler } from '@/utils/asyncHandler';
import { getCheckoutDetails } from '@/controllers/v1/common';

const router = express.Router();

router.get('/details', apiAuth, asyncHandler(getCheckoutDetails));
router.use('/', userAuth, checkoutRouter);

export default router;
