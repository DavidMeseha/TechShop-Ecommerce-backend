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
exports.getReviewIds = getReviewIds;
exports.getLikesId = getLikesId;
exports.getSavesId = getSavesId;
exports.getFollowingIds = getFollowingIds;
exports.addProductToCart = addProductToCart;
exports.getCartProductsIds = getCartProductsIds;
exports.getCartProducts = getCartProducts;
exports.removeProductFromCart = removeProductFromCart;
exports.changeLanguage = changeLanguage;
exports.getCountries = getCountries;
exports.getCities = getCities;
exports.getAllUserActions = getAllUserActions;
exports.findInAll = findInAll;
const Products_1 = __importDefault(require("../models/Products"));
const utilities_1 = require("../utilities");
const mongoose_1 = __importDefault(require("mongoose"));
const Users_1 = __importDefault(require("../models/Users"));
const Countries_1 = __importDefault(require("../models/Countries"));
const Vendors_1 = __importDefault(require("../models/Vendors"));
const Categories_1 = __importDefault(require("../models/Categories"));
const Tags_1 = __importDefault(require("../models/Tags"));
const Reviews_1 = __importDefault(require("../models/Reviews"));
function getCheckoutDetails(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        try {
            const foundUser = yield Users_1.default.findById(user._id)
                .select("cart addresses")
                .populate("cart.product")
                .lean()
                .exec();
            if (!foundUser || !foundUser.cart)
                throw new Error("No User found");
            let total = 0;
            for (const item of foundUser.cart)
                total += item.product.price.price * item.quantity;
            res.status(200).json({
                addresses: foundUser.addresses,
                cartItems: foundUser.cart,
                total,
                // clientSecret: paymentIntent.client_secret,
            });
        }
        catch (err) {
            res.status(400).json(err.message);
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
function addProductToCart(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        const productId = req.params.id;
        const quantity = req.body.quantity;
        const attributes = req.body.attributes;
        if (!productId)
            res.status(400).json("missing product id");
        try {
            const product = yield Products_1.default.findByIdAndUpdate(productId, {
                $inc: { carts: 1 },
            })
                .select("productAttributes")
                .lean()
                .exec();
            if (!product)
                throw new Error("wrong product Id");
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
            if (!updated.matchedCount)
                throw new Error("Could not add product to cart");
            res.status(200).json("Product added to cart");
        }
        catch (err) {
            res.status(400).json(err.message);
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
            if (language !== "en" && language !== "ar")
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
            const countries = yield Countries_1.default.find({}).lean().exec();
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
function getAllUserActions(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const user = res.locals.user;
        try {
            const foundUser = yield Users_1.default.findById(user._id).lean().exec();
            const reviews = yield Reviews_1.default.find({ customer: foundUser === null || foundUser === void 0 ? void 0 : foundUser._id })
                .select("_id")
                .lean()
                .exec();
            res.status(200).json({
                reviews: reviews !== null && reviews !== void 0 ? reviews : [],
                cart: (_a = foundUser === null || foundUser === void 0 ? void 0 : foundUser.cart) !== null && _a !== void 0 ? _a : [],
                likes: (_b = foundUser === null || foundUser === void 0 ? void 0 : foundUser.likes) !== null && _b !== void 0 ? _b : [],
                saves: (_c = foundUser === null || foundUser === void 0 ? void 0 : foundUser.saves) !== null && _c !== void 0 ? _c : [],
                follows: (_d = foundUser === null || foundUser === void 0 ? void 0 : foundUser.following) !== null && _d !== void 0 ? _d : [],
            });
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function findInAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = req.body;
        const items = [];
        const regex = new RegExp(options.searchText, "i");
        try {
            let optionsCount = -1;
            let key;
            for (key in options)
                if (options[key])
                    optionsCount++;
            if (options.products) {
                const products = yield Products_1.default.find({
                    $or: [{ name: regex }],
                })
                    .limit(Math.floor(8 / optionsCount))
                    .lean();
                const productItems = products.map((product) => ({
                    item: product,
                    type: "product",
                }));
                items.push(...productItems);
            }
            if (options.vendors) {
                const vendors = yield Vendors_1.default.find({
                    $or: [{ name: regex }],
                })
                    .limit(Math.floor(8 / optionsCount))
                    .lean();
                const vendorItems = vendors.map((vendor) => ({
                    item: vendor,
                    type: "vendor",
                }));
                items.push(...vendorItems);
            }
            if (options.categories) {
                const categories = yield Categories_1.default.find({
                    $or: [{ name: regex }],
                })
                    .limit(Math.floor(8 / optionsCount))
                    .lean();
                const categryItems = categories.map((category) => ({
                    item: category,
                    type: "category",
                }));
                items.push(...categryItems);
            }
            if (options.tags) {
                const tags = yield Tags_1.default.find({
                    $or: [{ name: regex }],
                })
                    .limit(Math.floor(8 / optionsCount))
                    .lean();
                const tagItems = tags.map((tag) => ({
                    item: tag,
                    type: "tag",
                }));
                items.push(...tagItems);
            }
            res.status(200).json(items);
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
