"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_controller_1 = require("../controllers/product.controller");
var express = require("express");
var router = express.Router();
router.get("/attributes/:id", product_controller_1.getProductAtterputes);
router.get("/reviews/:id", product_controller_1.getReviews);
router.get("/details/:seName", product_controller_1.getProductDetails);
exports.default = router;
