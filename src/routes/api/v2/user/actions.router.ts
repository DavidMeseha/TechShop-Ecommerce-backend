import express from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import {
  addReview,
  followVendor,
  likeProduct,
  saveProduct,
  unfollowVendor,
  unlikeProduct,
  unsaveProduct,
} from '@/controllers/v1/user';

const router = express.Router();

router.post('/likeProduct/:id', asyncHandler(likeProduct));
router.post('/unlikeProduct/:id', asyncHandler(unlikeProduct));
router.post('/saveProduct/:id', asyncHandler(saveProduct));
router.post('/unsaveProduct/:id', asyncHandler(unsaveProduct));
router.post('/followVendor/:id', asyncHandler(followVendor));
router.post('/unfollowVendor/:id', asyncHandler(unfollowVendor));
router.post('/addReview/:id', asyncHandler(addReview));

export default router;
