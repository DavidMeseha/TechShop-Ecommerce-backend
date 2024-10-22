import express, { Request, Response } from "express";
import upload from "../middlewares/upload.middleware";
import {
  addProductToCart,
  changeLanguage,
  getCartProducts,
  getCartProductsIds,
  getCities,
  getCountries,
  removeProductFromCart,
} from "../controllers/common.controller";
const router = express.Router();
const DOMAIN = process.env.DOMAIN;

router.get("/cart", getCartProducts);
router.get("/cart/ids", getCartProductsIds);
router.get("/countries", getCountries);
router.get("/cities/:id", getCities);

router.delete("/cart/remove/:id", removeProductFromCart);

router.post("/changeLanguage/:lang", changeLanguage);
router.post("/cart/add/:id", addProductToCart);
router.post(
  "/upload",
  upload.single("image"),
  (req: Request, res: Response) => {
    if (!DOMAIN || !req.file?.path) return;
    const imageUrl = DOMAIN + req.file.path.replace("public", "");
    res.status(200).json({ imageUrl });
  }
);

export default router;
