import { Router } from 'express';
import {
  getProductAttributes,
  getProductDetails,
  getReviews,
} from '../controllers/product.controller';
import express from 'express';
import { asyncHandler } from '../utils/asyncHandler';

const router: Router = express.Router();

router.get('/attributes/:seName', asyncHandler(getProductAttributes));
router.get('/reviews/:id', asyncHandler(getReviews));
router.get('/details/:seName', asyncHandler(getProductDetails));
router.get('/actions/:seName', asyncHandler(getProductDetails));

export default router;
