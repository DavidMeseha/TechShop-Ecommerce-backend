"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_middleware_1 = __importDefault(require("../middlewares/upload.middleware"));
const common_controller_1 = require("../controllers/common.controller");
const blob_1 = require("@vercel/blob");
const router = express_1.default.Router();
router.get("/reviewedIds", common_controller_1.getReviewIds);
router.get("/followingIds", common_controller_1.getFollowingIds);
router.get("/savesId", common_controller_1.getSavesId);
router.get("/likesId", common_controller_1.getLikesId);
router.get("/cart", common_controller_1.getCartProducts);
router.get("/cart/ids", common_controller_1.getCartProductsIds);
router.get("/allActions", common_controller_1.getAllUserActions);
router.get("/checkout", common_controller_1.getCheckoutDetails);
router.delete("/cart/remove/:id", common_controller_1.removeProductFromCart);
router.post("/changeLanguage/:lang", common_controller_1.changeLanguage);
router.post("/cart/add/:id", common_controller_1.addProductToCart);
router.post("/find", common_controller_1.findInAll);
router.post("/upload", upload_middleware_1.default.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        return res.status(400).json({ message: "error" });
    console.log(req.file);
    const file = req.file;
    try {
        const blob = yield (0, blob_1.put)(file.originalname, file.buffer, {
            access: "public",
            token: process.env.FILES_READ_WRITE_TOKEN
        });
        return res.status(200).json({ imageUrl: blob.url });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "" });
    }
}));
exports.default = router;
