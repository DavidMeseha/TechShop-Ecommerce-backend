import express from 'express';
import {
  addProductToCart,
  changeLanguage,
  getCartProducts,
  getCartProductsIds,
  getCheckoutDetails,
  removeProductFromCart,
} from '../controllers/common';
import { asyncHandler } from '../utils/asyncHandler';
const router = express.Router();

router.get('/checkout', asyncHandler(getCheckoutDetails));
router.post('/changeLanguage/:lang', asyncHandler(changeLanguage));

// Cart related routes
router.get('/cart', asyncHandler(getCartProducts));
router.get('/cart/ids', asyncHandler(getCartProductsIds));
router.post('/cart/add/:id', asyncHandler(addProductToCart));
router.delete('/cart/remove/:id', asyncHandler(removeProductFromCart));

export default router;
