"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_controller_1 = require("../controllers/product.controller");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/attributes/:id', product_controller_1.getProductAtterputes);
router.get('/reviews/:id', product_controller_1.getReviews);
router.get('/details/:seName', product_controller_1.getProductDetails);
exports.default = router;
