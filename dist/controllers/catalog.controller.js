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
exports.getAllVendorsSeName = getAllVendorsSeName;
exports.getAllCategoriesSeName = getAllCategoriesSeName;
exports.getAllTagsSeName = getAllTagsSeName;
const utilities_1 = require("../utilities");
const mongo_catalog_data_1 = __importDefault(require("../data/mongo-catalog.data"));
function getProducts(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const products = yield mongo_catalog_data_1.default.findProducts();
            res.status(200).json(products);
        }
        catch (err) {
            res.status(500).json((0, utilities_1.responseDto)('Failed to fetch products'));
        }
    });
}
function getSingleProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const product = yield mongo_catalog_data_1.default.findProductById(req.params.id);
            if (!product) {
                return res.status(404).json((0, utilities_1.responseDto)('Product not found'));
            }
            res.status(200).json(product);
        }
        catch (err) {
            res.status(500).json((0, utilities_1.responseDto)('Failed to fetch product'));
        }
    });
}
function homeFeed(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const page = parseInt((_b = (_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '1');
            const limit = parseInt((_d = (_c = req.query.limit) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : '2');
            const result = yield mongo_catalog_data_1.default.getHomeFeedProducts(page, limit);
            return res.status(200).json((0, utilities_1.responseDto)(result.data, true, result.pagination));
        }
        catch (err) {
            res.status(500).json((0, utilities_1.responseDto)('Failed to fetch home feed'));
        }
    });
}
function getVendorInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const vendor = yield mongo_catalog_data_1.default.findVendorBySeName(req.params.seName);
            if (!vendor) {
                return res.status(404).json((0, utilities_1.responseDto)('Vendor not found'));
            }
            res.status(200).json(vendor);
        }
        catch (err) {
            res.status(500).json((0, utilities_1.responseDto)('Failed to fetch vendor'));
        }
    });
}
function getVendorProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const page = parseInt((_b = (_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '1');
            const limit = 5;
            const result = yield mongo_catalog_data_1.default.findProductsByVendor(req.params.id, page, limit);
            res.status(200).json((0, utilities_1.responseDto)(result.data, true, result.pagination));
        }
        catch (err) {
            res.status(500).json((0, utilities_1.responseDto)('Failed to fetch vendor products'));
        }
    });
}
function getVendors(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const page = parseInt((_b = (_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '1');
            const limit = 5;
            const result = yield mongo_catalog_data_1.default.findVendors(page, limit);
            res.status(200).json((0, utilities_1.responseDto)(result.data, true, result.pagination));
        }
        catch (err) {
            res.status(500).json((0, utilities_1.responseDto)('Failed to fetch vendors'));
        }
    });
}
function getTags(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const page = parseInt((_b = (_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '1');
            const limit = 5;
            const result = yield mongo_catalog_data_1.default.findTags(page, limit);
            res.status(200).json((0, utilities_1.responseDto)(result.data, true, result.pagination));
        }
        catch (err) {
            res.status(500).json((0, utilities_1.responseDto)('Failed to fetch tags'));
        }
    });
}
function getTagInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tag = yield mongo_catalog_data_1.default.findTagBySeName(req.params.seName);
            if (!tag) {
                return res.status(404).json((0, utilities_1.responseDto)('Tag not found'));
            }
            res.status(200).json(tag);
        }
        catch (err) {
            res.status(500).json((0, utilities_1.responseDto)('Failed to fetch tag'));
        }
    });
}
function getTagProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const page = parseInt((_b = (_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '1');
            const limit = 5;
            const result = yield mongo_catalog_data_1.default.findProductsByTag(req.params.id, page, limit);
            res.status(200).json((0, utilities_1.responseDto)(result.data, true, result.pagination));
        }
        catch (err) {
            res.status(500).json((0, utilities_1.responseDto)('Failed to fetch tag products'));
        }
    });
}
function getCategories(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const page = parseInt((_b = (_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '1');
            const limit = 5;
            const result = yield mongo_catalog_data_1.default.findCategories(page, limit);
            res.status(200).json((0, utilities_1.responseDto)(result.data, true, result.pagination));
        }
        catch (err) {
            res.status(500).json((0, utilities_1.responseDto)('Failed to fetch categories'));
        }
    });
}
function getCategoryInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const category = yield mongo_catalog_data_1.default.findCategoryBySeName(req.params.seName);
            if (!category) {
                return res.status(404).json((0, utilities_1.responseDto)('Category not found'));
            }
            res.status(200).json(category);
        }
        catch (err) {
            res.status(500).json((0, utilities_1.responseDto)('Failed to fetch category'));
        }
    });
}
function getCategoryProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const page = parseInt((_b = (_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '1');
            const limit = 5;
            const result = yield mongo_catalog_data_1.default.findProductsByCategory(req.params.id, page, limit);
            res.status(200).json((0, utilities_1.responseDto)(result.data, true, result.pagination));
        }
        catch (err) {
            res.status(500).json((0, utilities_1.responseDto)('Failed to fetch category products'));
        }
    });
}
function getAllVendorsSeName(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const vendors = yield mongo_catalog_data_1.default.findAllVendorSeNames();
            res.status(200).json(vendors);
        }
        catch (err) {
            res.status(500).json((0, utilities_1.responseDto)('Failed to fetch vendor IDs'));
        }
    });
}
function getAllCategoriesSeName(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categories = yield mongo_catalog_data_1.default.findAllCategorySeNames();
            res.status(200).json(categories);
        }
        catch (err) {
            res.status(500).json((0, utilities_1.responseDto)('Failed to fetch category names'));
        }
    });
}
function getAllTagsSeName(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tags = yield mongo_catalog_data_1.default.findAllTagSeNames();
            res.status(200).json(tags);
        }
        catch (err) {
            res.status(500).json((0, utilities_1.responseDto)('Failed to fetch tag IDs'));
        }
    });
}
