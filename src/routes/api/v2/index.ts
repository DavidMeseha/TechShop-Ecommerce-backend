import express from 'express';
import userRouter from './user';
import productRouter from './product';
import catalogRouter from './catalog';
import authRouter from './auth';
import checkoutRouter from './checkout';
import commonRouter from './common';
import uploadnRouter from './upload.router';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/product', productRouter);
router.use('/catalog', catalogRouter);
router.use('/checkout', checkoutRouter);
router.use('/common', commonRouter);
router.post('/upload', uploadnRouter);

export default router;
