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
  getOrder,
  getOrders,
  getReviews,
  getSavedProducts,
  getUserInfo,
  likeProduct,
  newAdress,
  paymentIntent,
  placeOrder,
  saveProduct,
  unfollowVendor,
  unlikeProduct,
  unsaveProduct,
  updateInfo,
} from '../controllers/user';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.get('/likedProducts', asyncHandler(getLikedProducts));
router.get('/savedProducts', asyncHandler(getSavedProducts));
router.get('/followingVendors', asyncHandler(getFollowingVendors));
router.get('/reviews', asyncHandler(getReviews));
router.get('/info', asyncHandler(getUserInfo));
router.get('/addresses', asyncHandler(getAdresses));
router.get('/orders', asyncHandler(getOrders));
router.get('/order/:id', asyncHandler(getOrder));
router.get('/preperPayment', asyncHandler(paymentIntent));

router.post('/likeProduct/:id', asyncHandler(likeProduct));
router.post('/saveProduct/:id', asyncHandler(saveProduct));
router.post('/unlikeProduct/:id', asyncHandler(unlikeProduct));
router.post('/unsaveProduct/:id', asyncHandler(unsaveProduct));
router.post('/followVendor/:id', asyncHandler(followVendor));
router.post('/unfollowVendor/:id', asyncHandler(unfollowVendor));
router.post('/addReview/:id', asyncHandler(addReview));
router.post('/addresses/add', asyncHandler(newAdress));
router.post('/changePassword', asyncHandler(changePassword));
router.post('/order/submit', asyncHandler(placeOrder));

router.delete('/address/delete/:id', asyncHandler(removeAddress));

router.put('/addresses/edit/:id', asyncHandler(editAdress));
router.put('/info', asyncHandler(updateInfo));

export default router;
