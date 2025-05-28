import express from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { paymentIntent, placeOrder } from '@/controllers/v1/user/order.controller';

const router = express.Router();

router.get('/preperPayment', asyncHandler(paymentIntent));
router.post('/submit', asyncHandler(placeOrder));

export default router;
