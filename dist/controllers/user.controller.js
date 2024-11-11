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
exports.likeProduct = likeProduct;
exports.unlikeProduct = unlikeProduct;
exports.saveProduct = saveProduct;
exports.unsaveProduct = unsaveProduct;
exports.getLikedProducts = getLikedProducts;
exports.getSavedProducts = getSavedProducts;
exports.addReview = addReview;
exports.followVendor = followVendor;
exports.unfollowVendor = unfollowVendor;
exports.getFollowingVendors = getFollowingVendors;
exports.getUserInfo = getUserInfo;
exports.updateInfo = updateInfo;
exports.getReviews = getReviews;
exports.newAdress = newAdress;
exports.editAdress = editAdress;
exports.getAdresses = getAdresses;
exports.changePassword = changePassword;
exports.paymentIntent = paymentIntent;
exports.placeOrder = placeOrder;
exports.getOrders = getOrders;
exports.getOrdersIds = getOrdersIds;
exports.getOrder = getOrder;
const utilities_1 = require("../utilities");
const mongoose_1 = __importDefault(require("mongoose"));
const Users_1 = __importDefault(require("../models/Users"));
const Products_1 = __importDefault(require("../models/Products"));
const Reviews_1 = __importDefault(require("../models/Reviews"));
const Vendors_1 = __importDefault(require("../models/Vendors"));
const bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
const Orders_1 = __importDefault(require("../models/Orders"));
const stripe_1 = __importDefault(require("stripe"));
const STRIPE_SECRET = process.env.STRIPE_SECRET;
function likeProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        const productId = req.params.id;
        try {
            const isUpdated = (yield Products_1.default.updateOne({ _id: productId }, { $inc: { likes: 1 } })).matchedCount;
            if (!isUpdated)
                throw new Error("wrong Product Id");
            yield Users_1.default.updateOne({
                _id: user._id,
                likes: { $ne: new mongoose_1.default.Types.ObjectId(productId) },
            }, {
                $push: { likes: new mongoose_1.default.Types.ObjectId(productId) },
            });
            res.status(200).json((0, utilities_1.responseDto)("Product Liked"));
        }
        catch (err) {
            res
                .status(500)
                .json((0, utilities_1.responseDto)("could not complete the Like Action", false));
        }
    });
}
function unlikeProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        const productId = req.params.id;
        try {
            const isUpdated = (yield Users_1.default.updateOne({
                _id: user._id,
                likes: new mongoose_1.default.Types.ObjectId(productId),
            }, {
                $pull: { likes: new mongoose_1.default.Types.ObjectId(productId) },
            })).matchedCount;
            if (!isUpdated)
                throw new Error("Product is not liked");
            yield Products_1.default.updateOne({ _id: productId }, { $inc: { likes: -1 } });
            res.status(200).json((0, utilities_1.responseDto)("Product Unliked"));
        }
        catch (err) {
            res.status(400).json((0, utilities_1.responseDto)(err.message, false));
        }
    });
}
function saveProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        const productId = req.params.id;
        try {
            const isUpdated = !!(yield Users_1.default.updateOne({
                _id: user._id,
                saves: { $ne: new mongoose_1.default.Types.ObjectId(productId) },
            }, {
                $push: { saves: new mongoose_1.default.Types.ObjectId(productId) },
            })).matchedCount;
            if (!isUpdated)
                throw new Error("Product already saved");
            yield Products_1.default.updateOne({ _id: productId }, { $inc: { saves: 1 } });
            res.status(200).json((0, utilities_1.responseDto)("Product saved"));
        }
        catch (err) {
            res.status(400).json((0, utilities_1.responseDto)(err.message, false));
        }
    });
}
function unsaveProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        const productId = req.params.id;
        try {
            const isUpdated = !!(yield Users_1.default.updateOne({
                _id: user._id,
                saves: new mongoose_1.default.Types.ObjectId(productId),
            }, {
                $pull: { saves: new mongoose_1.default.Types.ObjectId(productId) },
            })).matchedCount;
            if (!isUpdated)
                throw new Error("could not unlike product it might be unliked already");
            yield Products_1.default.updateOne({ _id: productId }, { $inc: { saves: -1 } });
            res.status(200).json((0, utilities_1.responseDto)("Product Unsaved"));
        }
        catch (err) {
            res.status(400).json((0, utilities_1.responseDto)(err.message, false));
        }
    });
}
function getLikedProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        try {
            const found = yield Users_1.default.findById(user._id)
                .populate("likes")
                .select("likes")
                .lean()
                .exec();
            res.status(200).json(found === null || found === void 0 ? void 0 : found.likes);
        }
        catch (err) {
            res.status(500).json((0, utilities_1.responseDto)("error getting user lieks", false));
        }
    });
}
function getSavedProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        try {
            const found = yield Users_1.default.findById(user._id)
                .populate("saves")
                .select("saves")
                .lean()
                .exec();
            res.status(200).json(found === null || found === void 0 ? void 0 : found.saves);
        }
        catch (err) {
            res
                .status(500)
                .json((0, utilities_1.responseDto)("error getting user saved products", false));
        }
    });
}
function addReview(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        const productId = req.params.id;
        const review = req.body;
        try {
            const savedReview = yield Reviews_1.default.create(Object.assign(Object.assign({}, review), { customer: new mongoose_1.default.Types.ObjectId(user._id), product: new mongoose_1.default.Types.ObjectId(productId) })).then((res) => res.toJSON());
            if (!savedReview)
                return res.status(500).json((0, utilities_1.responseDto)("Unable to add review"));
            yield Products_1.default.updateOne({ _id: productId }, {
                $push: { productReviews: savedReview._id },
                $inc: {
                    "productReviewOverview.ratingSum": review.rating,
                    "productReviewOverview.totalReviews": 1,
                },
            }).then((res) => console.log(res));
            res.status(200).json(savedReview);
        }
        catch (err) {
            res.status(400).json("could not save review");
        }
    });
}
function followVendor(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        const vendorId = req.params.id;
        try {
            const vendorIsUpdated = !!(yield Vendors_1.default.updateOne({ _id: vendorId }, { $inc: { followersCount: 1 } })).matchedCount;
            if (!vendorIsUpdated)
                throw new Error("Wrong vendor id");
            const isUpdated = !!(yield Users_1.default.updateOne({
                _id: user._id,
                following: { $ne: new mongoose_1.default.Types.ObjectId(vendorId) },
            }, {
                $push: { following: new mongoose_1.default.Types.ObjectId(vendorId) },
            })).matchedCount;
            if (!isUpdated)
                throw new Error("vendor already followed");
            res.status(200).json((0, utilities_1.responseDto)("vendor followed successfully"));
        }
        catch (err) {
            res.status(400).json((0, utilities_1.responseDto)(err.message));
        }
    });
}
function unfollowVendor(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        const vendorId = req.params.id;
        try {
            const isUpdated = yield Users_1.default.updateOne({
                _id: user._id,
                following: new mongoose_1.default.Types.ObjectId(vendorId),
            }, {
                $pull: { following: new mongoose_1.default.Types.ObjectId(vendorId) },
            });
            if (!isUpdated.matchedCount)
                throw new Error("vendor is not followed");
            yield Vendors_1.default.updateOne({ _id: vendorId }, { $inc: { followersCount: -1 } });
            res.status(200).json((0, utilities_1.responseDto)("vendor unfollowed successfully"));
        }
        catch (err) {
            res.status(400).json((0, utilities_1.responseDto)(err.message));
        }
    });
}
function getFollowingVendors(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        if (!user)
            return;
        try {
            const foundUser = yield Users_1.default.findById(user._id)
                .select("following")
                .populate("following")
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
function getUserInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const user = res.locals.user;
        if (!user)
            return;
        try {
            const foundUser = yield Users_1.default.findById(user._id)
                .select("firstName lastName imageUrl dateOfBirth email gender phone orders")
                .lean()
                .exec();
            if (!foundUser)
                throw new Error("No user Found");
            const userProfile = {
                dateOfBirthDay: (_a = foundUser.dateOfBirth) === null || _a === void 0 ? void 0 : _a.day,
                dateOfBirthMonth: (_b = foundUser.dateOfBirth) === null || _b === void 0 ? void 0 : _b.month,
                dateOfBirthYear: (_c = foundUser.dateOfBirth) === null || _c === void 0 ? void 0 : _c.year,
                email: foundUser.email,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                gender: foundUser.gender,
                imageUrl: foundUser.imageUrl,
                phone: foundUser.phone,
                ordersCount: foundUser.orders.length,
            };
            res.status(200).json(userProfile);
        }
        catch (err) {
            res.status(400).json((0, utilities_1.responseDto)(err.message));
        }
    });
}
function updateInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        const user = res.locals.user;
        const form = req.body;
        if (!user)
            return;
        try {
            const updateUser = yield Users_1.default.findByIdAndUpdate(user._id, {
                firstName: form.firstName,
                lastName: form.lastName,
                gender: form.gender,
                imageUrl: form.imageUrl,
                phone: form.phone,
                dateOfBirth: {
                    day: form.dateOfBirthDay,
                    month: form.dateOfBirthMonth,
                    year: form.dateOfBirthYear,
                },
            })
                .select("firstName lastName imageUrl dateOfBirth email gender phone")
                .lean()
                .exec();
            if (!updateUser)
                throw new Error("No user Found");
            const userProfile = {
                dateOfBirthDay: (_a = updateUser.dateOfBirth) === null || _a === void 0 ? void 0 : _a.day,
                dateOfBirthMonth: (_b = updateUser.dateOfBirth) === null || _b === void 0 ? void 0 : _b.month,
                dateOfBirthYear: (_c = updateUser.dateOfBirth) === null || _c === void 0 ? void 0 : _c.year,
                email: updateUser.email,
                firstName: updateUser.firstName,
                lastName: updateUser.lastName,
                gender: (_d = updateUser.gender) !== null && _d !== void 0 ? _d : "",
                imageUrl: updateUser.imageUrl,
                phone: (_e = updateUser.phone) !== null && _e !== void 0 ? _e : "",
            };
            res.status(200).json(userProfile);
        }
        catch (err) {
            res.status(400).json((0, utilities_1.responseDto)(err.message));
        }
    });
}
function getReviews(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const user = res.locals.user;
        const page = parseInt((_b = (_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "1");
        const limit = 5;
        try {
            const reviews = yield Reviews_1.default.find({
                customer: new mongoose_1.default.Types.ObjectId(user._id),
            })
                .populate("customer")
                .populate({
                path: "product",
                select: "name",
            })
                .limit(limit + 1)
                .skip((page - 1) * limit)
                .lean()
                .exec();
            const hasNext = reviews.length > limit && !!reviews.pop();
            res
                .status(200)
                .json((0, utilities_1.responseDto)(reviews, true, { hasNext, limit, current: page }));
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function newAdress(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        let address = req.body;
        try {
            if (!address.address || !address.city || !address.country)
                throw new Error("should recive address, country and city");
            const updated = yield Users_1.default.findByIdAndUpdate(user._id, {
                $push: { addresses: Object.assign({}, address) },
            });
            res.status(200).json(updated);
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function editAdress(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        let address = req.body;
        let addressId = req.params.id;
        try {
            const updated = yield Users_1.default.updateOne({
                _id: user._id,
                addresses: {
                    $elemMatch: { _id: new mongoose_1.default.Types.ObjectId(addressId) },
                },
            }, {
                $set: {
                    "addresses.$.city": address.city,
                    "addresses.$.country": address.country,
                    "addresses.$.address": address.address,
                },
            });
            res.status(200).json(updated);
        }
        catch (err) {
            res.status(200).json(err.message);
        }
    });
}
function getAdresses(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        try {
            const foundUser = yield Users_1.default.findById(user._id)
                .select("addresses")
                .populate("addresses.city addresses.country")
                .lean()
                .exec();
            res.status(200).json(foundUser === null || foundUser === void 0 ? void 0 : foundUser.addresses);
        }
        catch (err) {
            res.status(200).json(err.message);
        }
    });
}
function changePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const user = res.locals.user;
        const { password, newPassword } = req.body;
        try {
            const foundUser = yield Users_1.default.findById(user._id)
                .select("password isLogin")
                .lean()
                .exec();
            const passwordMatching = bcrypt_nodejs_1.default.compareSync(password, (_a = foundUser === null || foundUser === void 0 ? void 0 : foundUser.password) !== null && _a !== void 0 ? _a : "");
            if (!passwordMatching)
                throw new Error("old Password");
            const updated = yield Users_1.default.updateOne({ _id: user._id }, { password: bcrypt_nodejs_1.default.hashSync(newPassword, bcrypt_nodejs_1.default.genSaltSync(8)) });
            if (!updated.modifiedCount)
                throw new Error("Password could not be changed");
            res.status(200).json(foundUser === null || foundUser === void 0 ? void 0 : foundUser.addresses);
        }
        catch (err) {
            res.status(200).json(err.message);
        }
    });
}
function paymentIntent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const user = res.locals.user;
        try {
            const foundUser = yield Users_1.default.findById(user._id)
                .populate("cart.product")
                .lean()
                .exec();
            if (!foundUser)
                throw new Error("No user Found");
            const cart = (_a = foundUser.cart) !== null && _a !== void 0 ? _a : [];
            let total = 25;
            for (const item of cart)
                total += item.product.price.price * item.quantity;
            if (!STRIPE_SECRET)
                throw new Error("Env failed on server to confirm payment");
            const stripe = new stripe_1.default(STRIPE_SECRET);
            const paymentIntent = yield stripe.paymentIntents.create({
                amount: total * 100,
                currency: "usd",
                payment_method_types: ["card"],
            });
            res.status(200).json({ paymentSecret: paymentIntent.client_secret });
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function placeOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const user = res.locals.user;
        const order = req.body;
        try {
            const foundUser = yield Users_1.default.findById(user._id)
                .populate("cart.product")
                .lean()
                .exec();
            if (!foundUser)
                throw new Error("No user Found");
            console.log(foundUser);
            const cart = (_a = foundUser.cart) !== null && _a !== void 0 ? _a : [];
            const userAddresses = foundUser.addresses;
            const shippingAddress = userAddresses.find((address) => String(address._id) === order.shippingAddressId);
            console.log(shippingAddress);
            let total = 0;
            for (const item of cart)
                total += item.product.price.price * item.quantity;
            const createdOrder = yield Orders_1.default.create({
                customer: user._id,
                billingStatus: order.billingStatus || "cod",
                billingMethod: order.billingMethod,
                shippingAddress: shippingAddress,
                items: cart,
                subTotal: total,
                totalValue: total + 25,
                shippingFees: 25,
            });
            if (!createdOrder)
                throw new Error("Could not create Order");
            const userUpdate = yield Users_1.default.findByIdAndUpdate(user._id, {
                $push: { orders: createdOrder._id },
            });
            if (!userUpdate)
                throw new Error();
            res.status(200).json(createdOrder);
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function getOrders(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        try {
            const foundUser = yield Users_1.default.findById(user._id)
                .select("orders")
                .populate(
            // "orders orders.items.product orders.shippingAddress.country orders.shippingAddress.city"
            {
                path: "orders",
                populate: "items.product shippingAddress.country shippingAddress.city",
            })
                .lean()
                .exec();
            if (!(foundUser === null || foundUser === void 0 ? void 0 : foundUser.orders))
                throw new Error("Could not find User Orders");
            res.status(200).json(foundUser.orders);
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function getOrdersIds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        try {
            const foundUser = yield Users_1.default.findById(user._id)
                .select("orders")
                .lean()
                .exec();
            if (!(foundUser === null || foundUser === void 0 ? void 0 : foundUser.orders))
                throw new Error("Could not find User Orders");
            res.status(200).json(foundUser.orders);
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function getOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        let orderId = req.params.id;
        try {
            const order = yield Orders_1.default.findOne({ customer: user._id, _id: orderId })
                .populate("customer items.product shippingAddress.country shippingAddress.city")
                .lean()
                .exec();
            if (!order)
                throw new Error("Could not find User Orders");
            res.status(200).json(order);
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
