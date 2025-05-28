import express from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { getCategories, getTags, getVendors } from '@/controllers/v1/catalog';

const router = express.Router();

router.get('/vendors', asyncHandler(getVendors));
router.get('/tags', asyncHandler(getTags));
router.get('/categories', getCategories);

export default router;
