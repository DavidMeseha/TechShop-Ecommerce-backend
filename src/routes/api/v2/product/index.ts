import express from 'express';
import productRouter from './product.router';
import { fetchUser } from '@/middlewares/auth.middleware';

const router = express.Router();

router.use('/', fetchUser, productRouter);

export default router;
