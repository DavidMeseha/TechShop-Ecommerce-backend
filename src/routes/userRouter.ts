import express from "express";
import {
  addReview,
  changePassword,
  editAdress,
  followVendor,
  getAdresses,
  getCheckoutDetails,
  getFollowingVendors,
  getLikedProducts,
  getOrder,
  getOrders,
  getOrdersIds,
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
} from "../controllers/user.controller";

const router = express.Router();

router.post("/likeProduct/:id", likeProduct);
router.post("/saveProduct/:id", saveProduct);
router.post("/unlikeProduct/:id", unlikeProduct);
router.post("/unsaveProduct/:id", unsaveProduct);
router.post("/followVendor/:id", followVendor);
router.post("/unfollowVendor/:id", unfollowVendor);
router.post("/addReview/:id", addReview);
router.post("/addresses/add", newAdress);
router.post("/changePassword", changePassword);
router.post("/order/submit", placeOrder);

router.put("/addresses/edit/:id", editAdress);
router.put("/info", updateInfo);

router.get("/likedProducts", getLikedProducts);
router.get("/savedProducts", getSavedProducts);
router.get("/followingVendors", getFollowingVendors);
router.get("/reviews", getReviews);
router.get("/info", getUserInfo);
router.get("/addresses", getAdresses);
router.get("/checkout", getCheckoutDetails);
router.get("/orders", getOrders);
router.get("/ordersIds", getOrdersIds);
router.get("/order/:id", getOrder);
router.get("/preperPayment", paymentIntent);

export default router;
