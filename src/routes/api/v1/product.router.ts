import express from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import {
  getProductAttributes,
  getProductDetails,
  getReviews,
  getUserActions,
} from '@/controllers/v1/product.controller';

const router = express.Router();

router.get('/attributes/:seName', asyncHandler(getProductAttributes));
router.get('/reviews/:id', asyncHandler(getReviews));
router.get('/details/:seName', asyncHandler(getProductDetails));
router.get('/actions/:seName', asyncHandler(getUserActions));

export default router;
