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
exports.alreadyInCart = alreadyInCart;
exports.validateProductAndAttributes = validateProductAndAttributes;
exports.addToCart = addToCart;
const mongoose_1 = require("mongoose");
const Products_1 = __importDefault(require("../models/Products"));
const Users_1 = __importDefault(require("../models/Users"));
const utilities_1 = require("../utilities");
function alreadyInCart(userId, productId) {
    return __awaiter(this, void 0, void 0, function* () {
        return !Users_1.default.findOne({
            _id: userId,
            'cart.product': new mongoose_1.Types.ObjectId(productId),
        });
    });
}
function validateProductAndAttributes(id, attributes) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield Products_1.default.findById(id)
            .select('productAttributes')
            .lean()
            .exec();
        if (!product)
            return false;
        return (0, utilities_1.validateAttributes)(attributes, product.productAttributes);
    });
}
function addToCart(userId, productId, attributes, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        const [updated, _product] = yield Promise.all([
            Users_1.default.updateOne({ _id: userId }, {
                $push: {
                    cart: {
                        product: new mongoose_1.Types.ObjectId(productId),
                        quantity,
                        attributes,
                    },
                },
            }),
            Products_1.default.findByIdAndUpdate(productId, { $inc: { carts: 1 } }),
        ]);
        if (!updated.matchedCount)
            return { isError: true, message: 'Failed to add product to cart' };
        return { isError: false, message: 'Product added to cart' };
    });
}
