"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catalog_controller_1 = require("../controllers/catalog.controller");
var express = require("express");
var router = express.Router();
router.get("/product/:id", catalog_controller_1.getSingleProduct);
router.get("/homefeed", catalog_controller_1.homeFeed);
router.get("/discover/vendors", catalog_controller_1.getVendors);
router.get("/discover/tags", catalog_controller_1.getTags);
router.get("/discover/categories", catalog_controller_1.getCategories);
router.get("/vendor/:id", catalog_controller_1.getVendorInfo);
router.get("/vendorProducts/:id", catalog_controller_1.getVendorProducts);
router.get("/tag/:id", catalog_controller_1.getTagInfo);
router.get("/tagProducts/:id", catalog_controller_1.getTagProducts);
router.get("/category/:id", catalog_controller_1.getCategoryInfo);
router.get("/categoryProducts/:id", catalog_controller_1.getCategoryProducts);
//just test
router.get("/test", catalog_controller_1.test);
exports.default = router;
