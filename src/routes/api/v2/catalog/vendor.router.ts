import { asyncHandler } from '@/utils/asyncHandler';
import { getAllVendorsSeName, getVendorInfo, getVendorProducts } from '@/controllers/v1/catalog';
import express from 'express';

const router = express.Router();

router.get('/all', asyncHandler(getAllVendorsSeName));
router.get('/Products/:id', asyncHandler(getVendorProducts));
router.get('/:seName', asyncHandler(getVendorInfo));

export default router;
