import { Router } from "express";
import {
  getProductAtterputes,
  getProductDetails,
  getReviews,
} from "../controllers/product.controller";

var express = require("express");
var router: Router = express.Router();

router.get("/attributes/:id", getProductAtterputes);
router.get("/reviews/:id", getReviews);
router.get("/details/:seName", getProductDetails);

export default router;
