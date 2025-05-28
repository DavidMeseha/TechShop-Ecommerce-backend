import express from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import {
  addProductToCart,
  getCartProducts,
  getCartProductsIds,
  removeProductFromCart,
} from '@/controllers/v1/common';

const router = express.Router();

router.get('/products', asyncHandler(getCartProducts));
router.get('/ids', asyncHandler(getCartProductsIds));

router.post('/add/:id', asyncHandler(addProductToCart));
router.delete('/remove/:id', asyncHandler(removeProductFromCart));

export default router;
