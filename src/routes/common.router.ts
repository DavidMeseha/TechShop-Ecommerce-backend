import express from 'express';
import upload from '../middlewares/upload.middleware';
import {
  addProductToCart,
  changeLanguage,
  findInAll,
  getCartProducts,
  getCartProductsIds,
  getCheckoutDetails,
  removeProductFromCart,
} from '../controllers/common';
import { uploadImage } from '../controllers/uploadImage.controller';
import { asyncHandler } from '../utils/asyncHandler';
const router = express.Router();

// Cart related routes
router.get('/cart', asyncHandler(getCartProducts));
router.get('/cart/ids', asyncHandler(getCartProductsIds));
router.post('/cart/add/:id', asyncHandler(addProductToCart));
router.delete('/cart/remove/:id', asyncHandler(removeProductFromCart));

// Checkout related routes
router.get('/checkout', asyncHandler(getCheckoutDetails));

// Search related routes
router.post('/find', asyncHandler(findInAll));

// Language related routes
router.post('/changeLanguage/:lang', asyncHandler(changeLanguage));

// File upload routes
router.post('/upload', upload.single('image'), asyncHandler(uploadImage));

export default router;
