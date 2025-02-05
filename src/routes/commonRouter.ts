import express from "express";
import upload from "../middlewares/upload.middleware";
import {
  addProductToCart,
  changeLanguage,
  findInAll,
  getAllUserActions,
  getCartProducts,
  getCartProductsIds,
  getCheckoutDetails,
  getFollowingIds,
  getLikesId,
  getReviewIds,
  getSavesId,
  removeProductFromCart,
} from "../controllers/common.controller";
import { uploadImage } from "../controllers/upload.controller";
const router = express.Router();

// User action related routes
router.get("/reviewedIds", getReviewIds);
router.get("/followingIds", getFollowingIds);
router.get("/savesId", getSavesId);
router.get("/likesId", getLikesId);
router.get("/allActions", getAllUserActions);

// Cart related routes
router.get("/cart", getCartProducts);
router.get("/cart/ids", getCartProductsIds);
router.post("/cart/add/:id", addProductToCart);
router.delete("/cart/remove/:id", removeProductFromCart);

// Checkout related routes
router.get("/checkout", getCheckoutDetails);

// Search related routes
router.post("/find", findInAll);

// Language related routes
router.post("/changeLanguage/:lang", changeLanguage);

// File upload routes
router.post("/upload", upload.single("image"), uploadImage);

export default router;
