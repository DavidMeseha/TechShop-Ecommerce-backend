import express from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { getSinglProduct } from '@/controllers/v1/catalog';
import {
  getProductAttributes,
  getProductDetails,
  getReviews,
} from '@/controllers/v1/product.controller';

const router = express.Router();

router.get('/:seName', asyncHandler(getSinglProduct));
router.get('/attributes/:seName', asyncHandler(getProductAttributes));
router.get('/reviews/:id', asyncHandler(getReviews));
router.get('/details/:seName', asyncHandler(getProductDetails));
router.get('/actions/:seName', asyncHandler(getProductDetails));

export default router;
