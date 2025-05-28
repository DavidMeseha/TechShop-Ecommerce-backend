import express from 'express';
import {
  addReview,
  changePassword,
  removeAddress,
  editAdress,
  followVendor,
  getAdresses,
  getFollowingVendors,
  getLikedProducts,
  getUserReviews,
  getSavedProducts,
  getUserInfo,
  likeProduct,
  newAdress,
  saveProduct,
  unfollowVendor,
  unlikeProduct,
  unsaveProduct,
  updateInfo,
} from '@/controllers/v1/user';
import { asyncHandler } from '@/utils/asyncHandler';
import { uploadImage } from '@/controllers/v1/uploadImage.controller';
import uploadMiddleware from '@/middlewares/upload.middleware';
import { getOrder, getOrders } from '@/controllers/v1/user/order.controller';

const router = express.Router();

router.get('/likedProducts', asyncHandler(getLikedProducts));
router.get('/savedProducts', asyncHandler(getSavedProducts));
router.get('/followingVendors', asyncHandler(getFollowingVendors));
router.get('/reviews', asyncHandler(getUserReviews));
router.get('/info', asyncHandler(getUserInfo));
router.get('/addresses', asyncHandler(getAdresses));
router.get('/orders', asyncHandler(getOrders));
router.get('/order/:id', asyncHandler(getOrder));

router.post('/likeProduct/:id', asyncHandler(likeProduct));
router.post('/unlikeProduct/:id', asyncHandler(unlikeProduct));
router.post('/saveProduct/:id', asyncHandler(saveProduct));
router.post('/unsaveProduct/:id', asyncHandler(unsaveProduct));
router.post('/followVendor/:id', asyncHandler(followVendor));
router.post('/unfollowVendor/:id', asyncHandler(unfollowVendor));
router.post('/addReview/:id', asyncHandler(addReview));
router.post('/addresses/add', asyncHandler(newAdress));

router.post('/changePassword', asyncHandler(changePassword));
router.post('/upload', uploadMiddleware.single('image'), asyncHandler(uploadImage));

router.delete('/address/delete/:id', asyncHandler(removeAddress));

router.put('/addresses/edit/:id', asyncHandler(editAdress));
router.put('/info', asyncHandler(updateInfo));

export default router;
