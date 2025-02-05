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
exports.getCheckoutDetails = getCheckoutDetails;
exports.addProductToCart = addProductToCart;
exports.getAllUserActions = getAllUserActions;
exports.findInAll = findInAll;
exports.getReviewIds = getReviewIds;
exports.getLikesId = getLikesId;
exports.getSavesId = getSavesId;
exports.getFollowingIds = getFollowingIds;
exports.getCartProductsIds = getCartProductsIds;
exports.getCartProducts = getCartProducts;
exports.removeProductFromCart = removeProductFromCart;
exports.changeLanguage = changeLanguage;
exports.getCountries = getCountries;
exports.getCities = getCities;
const mongoose_1 = __importDefault(require("mongoose"));
const utilities_1 = require("../utilities");
const Products_1 = __importDefault(require("../models/Products"));
const Users_1 = __importDefault(require("../models/Users"));
const Countries_1 = __importDefault(require("../models/Countries"));
const Vendors_1 = __importDefault(require("../models/Vendors"));
const Categories_1 = __importDefault(require("../models/Categories"));
const Tags_1 = __importDefault(require("../models/Tags"));
const Reviews_1 = __importDefault(require("../models/Reviews"));
const useT_1 = require("../locales/useT");
// Cart Related Controllers
/**
 * Get checkout details for the current user
 */
function getCheckoutDetails(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        try {
            const foundUser = yield Users_1.default.findById(user._id)
                .select("cart addresses")
                .populate("cart.product")
                .lean()
                .exec();
            if (!foundUser || !foundUser.cart) {
                return res.status(404).json((0, utilities_1.responseDto)("User not found"));
            }
            const total = foundUser.cart.reduce((sum, item) => sum + item.product.price.price * item.quantity, 0);
            return res.status(200).json({
                addresses: foundUser.addresses,
                cartItems: foundUser.cart,
                total,
            });
        }
        catch (error) {
            console.error("Error getting checkout details:", error);
            return res.status(500).json((0, utilities_1.responseDto)("Failed to get checkout details"));
        }
    });
}
/**
 * Add product to user's cart
 */
function addProductToCart(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        const { id: productId } = req.params;
        const { quantity, attributes } = req.body;
        if (!productId) {
            return res.status(400).json((0, utilities_1.responseDto)("Product ID is required"));
        }
        try {
            const product = yield Products_1.default.findByIdAndUpdate(productId, { $inc: { carts: 1 } }, { new: true })
                .select("productAttributes")
                .lean()
                .exec();
            if (!product) {
                return res.status(404).json((0, utilities_1.responseDto)("Product not found"));
            }
            (0, utilities_1.validateAttributes)(attributes !== null && attributes !== void 0 ? attributes : [], product.productAttributes);
            const updated = yield Users_1.default.updateOne({
                _id: user._id,
                cart: {
                    $not: {
                        $elemMatch: { product: new mongoose_1.default.Types.ObjectId(productId) },
                    },
                },
            }, {
                $push: {
                    cart: {
                        product: new mongoose_1.default.Types.ObjectId(productId),
                        quantity,
                        attributes,
                    },
                },
            });
            if (!updated.matchedCount) {
                return res.status(400).json((0, utilities_1.responseDto)("Failed to add product to cart"));
            }
            return res.status(200).json((0, utilities_1.responseDto)("Product added to cart", true));
        }
        catch (error) {
            console.error("Error adding product to cart:", error);
            return res.status(500).json((0, utilities_1.responseDto)("Failed to add product to cart"));
        }
    });
}
// User Actions Controllers
/**
 * Get all user actions (reviews, cart, likes, saves, follows)
 */
function getAllUserActions(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const user = res.locals.user;
        try {
            const [foundUser, reviews] = yield Promise.all([
                Users_1.default.findById(user._id).lean().exec(),
                Reviews_1.default.find({ customer: user._id }).select("_id").lean().exec(),
            ]);
            if (!foundUser) {
                return res.status(404).json((0, utilities_1.responseDto)("User not found"));
            }
            return res.status(200).json({
                reviews: reviews !== null && reviews !== void 0 ? reviews : [],
                cart: (_a = foundUser.cart) !== null && _a !== void 0 ? _a : [],
                likes: (_b = foundUser.likes) !== null && _b !== void 0 ? _b : [],
                saves: (_c = foundUser.saves) !== null && _c !== void 0 ? _c : [],
                follows: (_d = foundUser.following) !== null && _d !== void 0 ? _d : [],
            });
        }
        catch (error) {
            console.error("Error getting user actions:", error);
            return res.status(500).json((0, utilities_1.responseDto)("Failed to get user actions"));
        }
    });
}
// Search Controller
/**
 * Search across multiple collections
 */
function findInAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = req.body;
        if (!options.searchText) {
            return res.status(400).json((0, utilities_1.responseDto)("Search text is required"));
        }
        try {
            const query = options.searchText;
            const toleranceCount = Math.ceil(query.length * 0.4);
            const queryRegex = `${query.length >= 4 ? (0, utilities_1.generateVariants)(query, toleranceCount) : query}|${query}..`;
            const regex = new RegExp(queryRegex, "i");
            const enabledOptions = Object.entries(options).filter(([key, value]) => key !== "searchText" && value).length;
            const limit = Math.floor(8 / enabledOptions);
            const searchPromises = [];
            const items = [];
            if (options.products) {
                searchPromises.push(Products_1.default.find({ name: regex })
                    .limit(limit)
                    .lean()
                    .then((products) => products.map((item) => ({ item, type: "product" }))));
            }
            if (options.vendors) {
                searchPromises.push(Vendors_1.default.find({ name: regex })
                    .limit(limit)
                    .lean()
                    .then((vendors) => vendors.map((item) => ({ item, type: "vendor" }))));
            }
            if (options.categories) {
                searchPromises.push(Categories_1.default.find({ name: regex })
                    .limit(limit)
                    .lean()
                    .then((category) => category.map((item) => ({ item, type: "category" }))));
            }
            if (options.tags) {
                searchPromises.push(Tags_1.default.find({ name: regex })
                    .limit(limit)
                    .lean()
                    .then((tag) => tag.map((item) => ({ item, type: "tag" }))));
            }
            const results = yield Promise.all(searchPromises);
            results.forEach((result) => items.push(...result));
            return res.status(200).json(items);
        }
        catch (error) {
            console.error("Error searching:", error);
            return res.status(500).json((0, utilities_1.responseDto)("Search failed"));
        }
    });
}
function getReviewIds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        try {
            const reviews = yield Reviews_1.default.find({
                customer: new mongoose_1.default.Types.ObjectId(user._id),
            })
                .select("product")
                .lean()
                .exec();
            res.status(200).json(reviews.map((review) => review.product));
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function getLikesId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const user = res.locals.user;
        try {
            const found = yield Users_1.default.findById(user._id).select("likes").lean().exec();
            res.status(200).json((_a = found === null || found === void 0 ? void 0 : found.likes) !== null && _a !== void 0 ? _a : []);
        }
        catch (err) {
            res.status(500).json((0, utilities_1.responseDto)("error getting user lieks", false));
        }
    });
}
function getSavesId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const user = res.locals.user;
        try {
            const found = yield Users_1.default.findById(user._id).select("saves").lean().exec();
            res.status(200).json((_a = found === null || found === void 0 ? void 0 : found.saves) !== null && _a !== void 0 ? _a : []);
        }
        catch (err) {
            res
                .status(500)
                .json((0, utilities_1.responseDto)("error getting user saved products", false));
        }
    });
}
function getFollowingIds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        if (!user)
            return;
        try {
            const foundUser = yield Users_1.default.findById(user._id)
                .select("following")
                .lean()
                .exec();
            if (!foundUser)
                throw new Error("No user Found");
            res.status(200).json(foundUser.following);
        }
        catch (err) {
            res.status(400).json((0, utilities_1.responseDto)(err.message));
        }
    });
}
function getCartProductsIds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        try {
            const userCart = yield Users_1.default.findById(user._id)
                .select("cart.product cart.quantity")
                .lean()
                .exec();
            res.status(200).json(userCart === null || userCart === void 0 ? void 0 : userCart.cart);
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function getCartProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        try {
            const userCart = yield Users_1.default.findById(user._id)
                .select("cart")
                .populate("cart.product")
                .lean()
                .exec();
            res.status(200).json(userCart === null || userCart === void 0 ? void 0 : userCart.cart);
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function removeProductFromCart(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        const productId = req.params.id;
        try {
            const updated = yield Users_1.default.updateOne({
                _id: user._id,
                cart: {
                    $elemMatch: { product: new mongoose_1.default.Types.ObjectId(productId) },
                },
            }, {
                $pull: { cart: { product: new mongoose_1.default.Types.ObjectId(productId) } },
            });
            if (!updated.modifiedCount)
                throw new Error("The product is not in user's cart");
            yield Products_1.default.updateOne({ _id: productId }, { $inc: { carts: -1 } }).exec();
            res.status(200).json("Item Removed from cart");
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function changeLanguage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        const language = req.params.lang;
        try {
            const isSupported = !!useT_1.languages.find((lang) => lang === language);
            if (!isSupported)
                throw new Error("language is not supported");
            yield Users_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(user._id) }, { language: language });
            res.status(200).json("language changed");
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function getCountries(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const countries = yield Countries_1.default.find({}).select("-cities").lean().exec();
            res.status(200).json(countries);
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function getCities(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const countryId = req.params.id;
        try {
            const country = yield Countries_1.default.findById(countryId)
                .select("cities")
                .populate("cities")
                .lean()
                .exec();
            setTimeout(() => {
                res.status(200).json(country === null || country === void 0 ? void 0 : country.cities);
            }, 2000);
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
