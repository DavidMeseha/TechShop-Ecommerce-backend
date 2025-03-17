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
const Reviews_1 = __importDefault(require("../models/Reviews"));
const Users_1 = __importDefault(require("../models/Users"));
const addToCart_data_1 = require("./addToCart.data");
const Products_1 = __importDefault(require("../models/Products"));
const Vendors_1 = __importDefault(require("../models/Vendors"));
const Categories_1 = __importDefault(require("../models/Categories"));
const Tags_1 = __importDefault(require("../models/Tags"));
function getUserCart(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return Users_1.default.findById(id).select('cart addresses').populate('cart.product').lean();
    });
}
function addProductToUserCart(userId, productId, attributes, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingCartItem = yield (0, addToCart_data_1.alreadyInCart)(userId, productId);
        if (existingCartItem)
            return { isError: true, message: 'Product already exists in cart' };
        const validProduct = yield (0, addToCart_data_1.validateProductAndAttributes)(productId, attributes);
        if (!validProduct)
            return { isError: true, message: 'Product or attributes not valid' };
        return yield (0, addToCart_data_1.addToCart)(userId, productId, attributes, quantity);
    });
}
function allUserActions(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const [foundUser, reviews] = yield Promise.all([
            Users_1.default.findById(userId)
                .lean()
                .exec(),
            Reviews_1.default.find({ customer: userId }).select('_id').lean().exec(),
        ]);
        if (foundUser)
            return {
                reviews: reviews !== null && reviews !== void 0 ? reviews : [],
                cart: (_a = foundUser.cart) !== null && _a !== void 0 ? _a : [],
                likes: (_b = foundUser.likes) !== null && _b !== void 0 ? _b : [],
                saves: (_c = foundUser.saves) !== null && _c !== void 0 ? _c : [],
                follows: (_d = foundUser.following) !== null && _d !== void 0 ? _d : [],
            };
    });
}
function findProductsByName(regex, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        return Products_1.default.find({ name: regex })
            .limit(limit)
            .lean()
            .then((products) => products.map((item) => ({ item, type: 'product' })));
    });
}
function findVendorsByName(regex, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        return Vendors_1.default.find({ name: regex })
            .limit(limit)
            .lean()
            .then((vendors) => vendors.map((item) => ({ item, type: 'vendor' })));
    });
}
function findCategoriesByName(regex, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        return Categories_1.default.find({ name: regex })
            .limit(limit)
            .lean()
            .then((category) => category.map((item) => ({ item, type: 'category' })));
    });
}
function findTagsByName(regex, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        return Tags_1.default.find({ name: regex })
            .limit(limit)
            .lean()
            .then((tag) => tag.map((item) => ({ item, type: 'tag' })));
    });
}
exports.default = {
    allUserActions,
    addProductToUserCart,
    getUserCart,
    findProductsByName,
    findVendorsByName,
    findCategoriesByName,
    findTagsByName,
};
