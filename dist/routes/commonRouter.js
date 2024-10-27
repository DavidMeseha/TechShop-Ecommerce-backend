"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_middleware_1 = __importDefault(require("../middlewares/upload.middleware"));
const common_controller_1 = require("../controllers/common.controller");
const router = express_1.default.Router();
router.get("/cart", common_controller_1.getCartProducts);
router.get("/cart/ids", common_controller_1.getCartProductsIds);
router.get("/countries", common_controller_1.getCountries);
router.get("/cities/:id", common_controller_1.getCities);
router.delete("/cart/remove/:id", common_controller_1.removeProductFromCart);
router.post("/changeLanguage/:lang", common_controller_1.changeLanguage);
router.post("/cart/add/:id", common_controller_1.addProductToCart);
router.post("/upload", upload_middleware_1.default.single("image"), (req, res) => {
    var _a;
    if (!((_a = req.file) === null || _a === void 0 ? void 0 : _a.path))
        return;
    const protocol = req.protocol; // 'http' or 'https'
    const host = req.get("host"); // domain name and port
    const fullUrl = `${protocol}://${host}`;
    const imageUrl = fullUrl + req.file.path.replace("public", "");
    res.status(200).json({ imageUrl });
});
exports.default = router;
