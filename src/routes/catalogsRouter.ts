import {
  getCategories,
  getCategoryInfo,
  getCategoryProducts,
  getSingleProduct,
  getTagInfo,
  getTagProducts,
  getTags,
  getVendorInfo,
  getVendorProducts,
  getVendors,
  homeFeed,
  test,
} from "../controllers/catalog.controller";

var express = require("express");
var router = express.Router();

router.get("/product/:id", getSingleProduct);
router.get("/homefeed", homeFeed);
router.get("/discover/vendors", getVendors);
router.get("/discover/tags", getTags);
router.get("/discover/categories", getCategories);
router.get("/vendor/:id", getVendorInfo);
router.get("/vendorProducts/:id", getVendorProducts);
router.get("/tag/:id", getTagInfo);
router.get("/tagProducts/:id", getTagProducts);
router.get("/category/:id", getCategoryInfo);
router.get("/categoryProducts/:id", getCategoryProducts);

//just test
router.get("/test", test);

export default router;
