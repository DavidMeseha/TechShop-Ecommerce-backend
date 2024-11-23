import {
  getAllCategoriesSeNames,
  getAllVendorsIds,
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
router.get("/vendor/:seName", getVendorInfo);
router.get("/vendorProducts/:id", getVendorProducts);
router.get("/tag/:seName", getTagInfo);
router.get("/tagProducts/:id", getTagProducts);
router.get("/category/:seName", getCategoryInfo);
router.get("/categoryProducts/:id", getCategoryProducts);
router.get("/allVendors", getAllVendorsIds);
router.get("/allCategories", getAllCategoriesSeNames);
router.get("/allTags", getAllVendorsIds);

//just test
router.get("/test", test);

export default router;
