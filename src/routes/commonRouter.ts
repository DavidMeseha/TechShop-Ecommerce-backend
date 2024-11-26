import express, { Request, Response } from "express";
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
import { put } from "@vercel/blob";
const router = express.Router();

router.get("/reviewedIds", getReviewIds);
router.get("/followingIds", getFollowingIds);
router.get("/savesId", getSavesId);
router.get("/likesId", getLikesId);
router.get("/cart", getCartProducts);
router.get("/cart/ids", getCartProductsIds);
router.get("/allActions", getAllUserActions);
router.get("/checkout", getCheckoutDetails);

router.delete("/cart/remove/:id", removeProductFromCart);

router.post("/changeLanguage/:lang", changeLanguage);
router.post("/cart/add/:id", addProductToCart);
router.post("/find", findInAll);
router.post(
  "/upload",
  upload.single("image"),
  async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ message: "error" });
    console.log(req.file)
    const file = req.file;

    try {
      const blob = await put(file.originalname, file.buffer, {
        access: "public",
        token: process.env.FILES_READ_WRITE_TOKEN
      });
      return res.status(200).json({ imageUrl: blob.url });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "" });
    }
  }
);

export default router;
