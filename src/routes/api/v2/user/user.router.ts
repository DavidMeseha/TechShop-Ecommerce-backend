import express from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { getOrder, getOrders } from '@/controllers/v1/user/order.controller';
import {
  changePassword,
  getAdresses,
  getFollowingVendors,
  getLikedProducts,
  getUserReviews,
  getSavedProducts,
  getUserInfo,
  updateInfo,
} from '@/controllers/v1/user';

const router = express.Router();

router.get('/likedProducts', asyncHandler(getLikedProducts));
router.get('/savedProducts', asyncHandler(getSavedProducts));
router.get('/followingVendors', asyncHandler(getFollowingVendors));
router.get('/reviews', asyncHandler(getUserReviews));
router.get('/info', asyncHandler(getUserInfo));
router.get('/addresses', asyncHandler(getAdresses));
router.get('/orders', asyncHandler(getOrders));
router.get('/order/:id', asyncHandler(getOrder));

router.post('/changePassword', asyncHandler(changePassword));
router.put('/info', asyncHandler(updateInfo));

export default router;
