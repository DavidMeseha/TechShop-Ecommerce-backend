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
const Products_1 = __importDefault(require("../models/Products"));
const Vendors_1 = __importDefault(require("../models/Vendors"));
const Tags_1 = __importDefault(require("../models/Tags"));
const Categories_1 = __importDefault(require("../models/Categories"));
function findProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        return Products_1.default.find({}).lean();
    });
}
function findProductById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return Products_1.default.findById(id)
            .populate({ path: 'vendor', select: '_id name imageUrl seName' })
            .populate('productTags')
            .populate({
            path: 'productReviews',
            select: 'product customer reviewText rating',
            populate: 'customer',
        })
            .lean();
    });
}
function findProductsByVendor(vendorId, page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        const products = yield Products_1.default.find({ vendor: vendorId })
            .populate('vendor productTags')
            .limit(limit + 1)
            .skip((page - 1) * limit)
            .lean();
        const hasNext = products.length > limit;
        if (hasNext)
            products.pop();
        return {
            data: products,
            pagination: { hasNext, limit, current: page },
        };
    });
}
function findProductsByTag(tagId, page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        const products = yield Products_1.default.find({ productTags: tagId })
            .populate('productTags vendor')
            .limit(limit + 1)
            .skip((page - 1) * limit)
            .lean();
        const hasNext = products.length > limit;
        if (hasNext)
            products.pop();
        return {
            data: products,
            pagination: { hasNext, limit, current: page },
        };
    });
}
function findProductsByCategory(categoryId, page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        const products = yield Products_1.default.find({ category: categoryId })
            .populate('productTags vendor')
            .limit(limit + 1)
            .skip((page - 1) * limit)
            .lean();
        const hasNext = products.length > limit;
        if (hasNext)
            products.pop();
        return {
            data: products,
            pagination: { hasNext, limit, current: page },
        };
    });
}
function getHomeFeedProducts(page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        const products = yield Products_1.default.find({})
            .populate('vendor productTags')
            .limit(limit + 1)
            .skip((page - 1) * limit)
            .lean();
        const hasNext = products.length > limit;
        if (hasNext)
            products.pop();
        return {
            data: products,
            pagination: { hasNext, limit, current: page },
        };
    });
}
function findVendorBySeName(seName) {
    return __awaiter(this, void 0, void 0, function* () {
        return Vendors_1.default.findOne({ seName }).lean();
    });
}
function findVendors(page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        const vendors = yield Vendors_1.default.find({})
            .limit(limit + 1)
            .skip((page - 1) * limit)
            .lean();
        const hasNext = vendors.length > limit;
        if (hasNext)
            vendors.pop();
        return {
            data: vendors,
            pagination: { hasNext, limit, current: page },
        };
    });
}
function findAllVendorSeNames() {
    return __awaiter(this, void 0, void 0, function* () {
        return Vendors_1.default.find({}).select('seName').lean();
    });
}
function findTagBySeName(seName) {
    return __awaiter(this, void 0, void 0, function* () {
        return Tags_1.default.findOne({ seName }).lean();
    });
}
function findTags(page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        const tags = yield Tags_1.default.find({})
            .limit(limit + 1)
            .skip((page - 1) * limit)
            .lean();
        const hasNext = tags.length > limit;
        if (hasNext)
            tags.pop();
        return {
            data: tags,
            pagination: { hasNext, limit, current: page },
        };
    });
}
function findAllTagSeNames() {
    return __awaiter(this, void 0, void 0, function* () {
        return Tags_1.default.find({}).select('seName').lean();
    });
}
function findCategoryBySeName(seName) {
    return __awaiter(this, void 0, void 0, function* () {
        return Categories_1.default.findOne({ seName }).lean();
    });
}
function findCategories(page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        const categories = yield Categories_1.default.find({})
            .limit(limit + 1)
            .skip((page - 1) * limit)
            .lean();
        const hasNext = categories.length > limit;
        if (hasNext)
            categories.pop();
        return {
            data: categories,
            pagination: { hasNext, limit, current: page },
        };
    });
}
function findAllCategorySeNames() {
    return __awaiter(this, void 0, void 0, function* () {
        return Categories_1.default.find({}).select('seName').lean();
    });
}
exports.default = {
    findAllCategorySeNames,
    findAllTagSeNames,
    findAllVendorSeNames,
    findCategories,
    findCategoryBySeName,
    findProductById,
    findProducts,
    findProductsByCategory,
    findProductsByVendor,
    findVendors,
    getHomeFeedProducts,
    findTagBySeName,
    findTags,
    findVendorBySeName,
    findProductsByTag,
};
