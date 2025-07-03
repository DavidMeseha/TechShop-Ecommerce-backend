import express from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { getAllTagsSeName, getTagInfo, getTagProducts } from '@/controllers/v1/catalog';

const router = express.Router();

router.get('/all', asyncHandler(getAllTagsSeName));
router.get('/products/:seName', asyncHandler(getTagProducts));
router.get('/:seName', asyncHandler(getTagInfo));

export default router;
