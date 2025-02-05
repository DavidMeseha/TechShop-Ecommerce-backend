"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_middleware_1 = __importDefault(require("../middlewares/upload.middleware"));
const common_controller_1 = require("../controllers/common.controller");
const upload_controller_1 = require("../controllers/upload.controller");
const router = express_1.default.Router();
// User action related routes
router.get("/reviewedIds", common_controller_1.getReviewIds);
router.get("/followingIds", common_controller_1.getFollowingIds);
router.get("/savesId", common_controller_1.getSavesId);
router.get("/likesId", common_controller_1.getLikesId);
router.get("/allActions", common_controller_1.getAllUserActions);
// Cart related routes
router.get("/cart", common_controller_1.getCartProducts);
router.get("/cart/ids", common_controller_1.getCartProductsIds);
router.post("/cart/add/:id", common_controller_1.addProductToCart);
router.delete("/cart/remove/:id", common_controller_1.removeProductFromCart);
// Checkout related routes
router.get("/checkout", common_controller_1.getCheckoutDetails);
// Search related routes
router.post("/find", common_controller_1.findInAll);
// Language related routes
router.post("/changeLanguage/:lang", common_controller_1.changeLanguage);
// File upload routes
router.post("/upload", upload_middleware_1.default.single("image"), upload_controller_1.uploadImage);
exports.default = router;
