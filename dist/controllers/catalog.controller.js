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
exports.getProducts = getProducts;
exports.getSingleProduct = getSingleProduct;
exports.homeFeed = homeFeed;
exports.getVendorInfo = getVendorInfo;
exports.getVendorProducts = getVendorProducts;
exports.getVendors = getVendors;
exports.getTags = getTags;
exports.getTagInfo = getTagInfo;
exports.getTagProducts = getTagProducts;
exports.getCategories = getCategories;
exports.getCategoryInfo = getCategoryInfo;
exports.getCategoryProducts = getCategoryProducts;
exports.getAllVendorsIds = getAllVendorsIds;
exports.getAllCategoriesSeNames = getAllCategoriesSeNames;
exports.getAllTagsIds = getAllTagsIds;
exports.test = test;
const Products_1 = __importDefault(require("../models/Products"));
const utilities_1 = require("../utilities");
const Vendors_1 = __importDefault(require("../models/Vendors"));
const Tags_1 = __importDefault(require("../models/Tags"));
const Categories_1 = __importDefault(require("../models/Categories"));
function getProducts(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const products = yield Products_1.default.find({}).exec();
        res.status(200).json(products);
    });
}
function getSingleProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const product = yield Products_1.default.findById(id)
            .populate({ path: "vendor", select: "_id name imageUrl seName" })
            .populate({
            path: "productReviews",
            select: "product customer reviewText rating",
            populate: "customer",
        })
            .lean()
            .exec();
        res.status(200).json(product);
    });
}
function homeFeed(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // const user: IUserTokenPayload = res.locals.user;
        var _a, _b, _c, _d;
        // const userInfo = await Users.findById(user._id)
        //   .populate("recentProducts")
        //   .lean()
        //   .exec();
        const page = parseInt((_b = (_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "1");
        const limit = parseInt((_d = (_c = req.query.limit) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : "2");
        let products = yield Products_1.default.find({})
            .populate("vendor productTags")
            .limit(limit + 1)
            .skip((page - 1) * limit)
            .exec();
        const hasNext = products.length > limit && !!products.pop();
        return res
            .status(200)
            .json((0, utilities_1.responseDto)(products, true, { hasNext, limit, current: page }));
    });
}
function getVendorInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const seName = req.params.seName;
        try {
            const vendor = yield Vendors_1.default.findOne({ seName: seName }).lean().exec();
            res.status(200).json(vendor);
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function getVendorProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const vendorId = req.params.id;
        const page = parseInt((_b = (_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "1");
        const limit = 5;
        try {
            const products = yield Products_1.default.find({ vendor: vendorId })
                .populate("vendor productTags")
                .limit(limit + 1)
                .skip((page - 1) * limit)
                .lean()
                .exec();
            const hasNext = products.length > limit && !!products.pop();
            res
                .status(200)
                .json((0, utilities_1.responseDto)(products, true, { hasNext, limit, current: page }));
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function getVendors(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const page = parseInt((_b = (_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "1");
        const limit = 5;
        try {
            const vendors = yield Vendors_1.default.find({})
                .limit(limit + 1)
                .skip((page - 1) * limit)
                .lean()
                .exec();
            const hasNext = vendors.length > limit && !!vendors.pop();
            res
                .status(200)
                .json((0, utilities_1.responseDto)(vendors, true, { hasNext, limit, current: page }));
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function getTags(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const page = parseInt((_b = (_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "1");
        const limit = 5;
        try {
            const tags = yield Tags_1.default.find({})
                .limit(limit + 1)
                .skip((page - 1) * limit)
                .lean()
                .exec();
            const hasNext = tags.length > limit && !!tags.pop();
            res
                .status(200)
                .json((0, utilities_1.responseDto)(tags, true, { hasNext, limit, current: page }));
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function getTagInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const tagId = req.params.id;
        try {
            const tag = yield Tags_1.default.findById(tagId).lean().exec();
            res.status(200).json(tag);
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function getTagProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const tagId = req.params.id;
        const page = parseInt((_b = (_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "1");
        const limit = 5;
        try {
            const products = yield Products_1.default.find({ productTags: tagId })
                .populate("productTags vendor")
                .limit(limit + 1)
                .skip((page - 1) * limit)
                .lean()
                .exec();
            const hasNext = products.length > limit && !!products.pop();
            res
                .status(200)
                .json((0, utilities_1.responseDto)(products, true, { hasNext, limit, current: page }));
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function getCategories(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const page = parseInt((_b = (_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "1");
        const limit = 5;
        try {
            const categories = yield Categories_1.default.find({})
                .limit(limit + 1)
                .skip((page - 1) * limit)
                .lean()
                .exec();
            const hasNext = categories.length > limit && !!categories.pop();
            res
                .status(200)
                .json((0, utilities_1.responseDto)(categories, true, { hasNext, limit, current: page }));
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function getCategoryInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const seName = req.params.seName;
        try {
            const category = yield Categories_1.default.findOne({ seName: seName }).lean().exec();
            res.status(200).json(category);
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function getCategoryProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const categoryId = req.params.id;
        const page = parseInt((_b = (_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "1");
        const limit = 5;
        try {
            const products = yield Products_1.default.find({ category: categoryId })
                .populate("productTags vendor")
                .limit(limit + 1)
                .skip((page - 1) * limit)
                .lean()
                .exec();
            const hasNext = products.length > limit && !!products.pop();
            res
                .status(200)
                .json((0, utilities_1.responseDto)(products, true, { hasNext, limit, current: page }));
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
function getAllVendorsIds(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const vendors = yield Vendors_1.default.find({}).select("seName").lean().exec();
        res.status(200).json(vendors);
    });
}
function getAllCategoriesSeNames(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const tags = yield Tags_1.default.find({}).select("seName").lean().exec();
        res.status(200).json(tags);
    });
}
function getAllTagsIds(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const categories = yield Categories_1.default.find({}).select("_id").lean().exec();
        res.status(200).json(categories);
    });
}
function test(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let key;
        let x;
        try {
            // for (key in countries) {
            //   const cities = countries[key][2] as string[][];
            //   const citiesMap = cities.map((city) => ({
            //     name: city[0],
            //     code: city[1],
            //   }));
            //   x = await Cities.insertMany([...citiesMap]);
            //   const ids = x.map((anX) => anX._id);
            //   const c = Counties.create({
            //     name: countries[key][0],
            //     code: countries[key][1],
            //     cities: ids,
            //   });
            // }
            res.status(200).json(x);
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    });
}
