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
import { uploadImage } from '../controllers/upload.controller';
const router = express.Router();

// Cart related routes
router.get('/cart', getCartProducts);
router.get('/cart/ids', getCartProductsIds);
router.post('/cart/add/:id', addProductToCart);
router.delete('/cart/remove/:id', removeProductFromCart);

// Checkout related routes
router.get('/checkout', getCheckoutDetails);

// Search related routes
router.post('/find', findInAll);

// Language related routes
router.post('/changeLanguage/:lang', changeLanguage);

// File upload routes
router.post('/upload', upload.single('image'), uploadImage);

export default router;
