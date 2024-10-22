import express from "express";
import {
  addReview,
  changePassword,
  editAdress,
  followVendor,
  getAdresses,
  getCheckoutDetails,
  getFollowingIds,
  getFollowingVendors,
  getLikedProducts,
  getLikesId,
  getReviewIds,
  getReviews,
  getSavedProducts,
  getSavesId,
  getUserInfo,
  likeProduct,
  newAdress,
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

router.get("/likesId", getLikesId);
router.get("/likedProducts", getLikedProducts);
router.get("/savesId", getSavesId);
router.get("/savedProducts", getSavedProducts);
router.get("/followingIds", getFollowingIds);
router.get("/followingVendors", getFollowingVendors);
router.get("/reviewedIds", getReviewIds);
router.get("/reviews", getReviews);
router.get("/info", getUserInfo);
router.get("/addresses", getAdresses);
router.get("/checkout", getCheckoutDetails);

export default router;
