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
  (req: Request, res: Response) => {
    if (!req.file?.path) return;
    const protocol = req.protocol; // 'http' or 'https'
    const host = req.get("host"); // domain name and port
    const fullUrl = `${protocol}://${host}`;
    const imageUrl = fullUrl + req.file.path.replace("public", "");
    res.status(200).json({ imageUrl });
  }
);

export default router;
