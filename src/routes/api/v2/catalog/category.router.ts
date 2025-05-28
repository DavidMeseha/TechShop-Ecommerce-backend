import express from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import {
  getAllCategoriesSeName,
  getCategoryInfo,
  getCategoryProducts,
} from '@/controllers/v1/catalog';

const router = express.Router();

router.get('/all', asyncHandler(getAllCategoriesSeName));
router.get('/products/:id', asyncHandler(getCategoryProducts));
router.get('/:seName', asyncHandler(getCategoryInfo));

export default router;
