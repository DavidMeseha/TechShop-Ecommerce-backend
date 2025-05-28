import { findInAll } from '@/controllers/v1/common';
import { asyncHandler } from '@/utils/asyncHandler';
import { homeFeed } from '@/controllers/v1/catalog';
import express from 'express';

const router = express.Router();

router.get('/homefeed', asyncHandler(homeFeed));
router.post('/find', asyncHandler(findInAll));

export default router;
