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
exports.getProductAtterputes = getProductAtterputes;
exports.getProductDetails = getProductDetails;
exports.getReviews = getReviews;
const mongoose_1 = __importDefault(require("mongoose"));
const Products_1 = __importDefault(require("../models/Products"));
const Reviews_1 = __importDefault(require("../models/Reviews"));
const utilities_1 = require("../utilities");
/**
 * Get product attributes by product ID
 */
function getProductAtterputes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json((0, utilities_1.responseDto)('Invalid product ID'));
        }
        try {
            const product = yield Products_1.default.findById(id).select('productAttributes name').lean().exec();
            if (!product) {
                return res.status(404).json((0, utilities_1.responseDto)('Product not found'));
            }
            return res.status(200).json(product);
        }
        catch (error) {
            console.error('Error fetching product attributes:', error);
            return res.status(500).json((0, utilities_1.responseDto)('Failed to fetch product attributes'));
        }
    });
}
/**
 * Get product details by SEO name
 */
function getProductDetails(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { seName } = req.params;
        if (!seName) {
            return res.status(400).json((0, utilities_1.responseDto)('SEO name is required'));
        }
        try {
            const product = yield Products_1.default.findOne({ seName })
                .populate([{ path: 'vendor' }, { path: 'category' }, { path: 'productTags' }])
                .select('-productReviews')
                .lean()
                .exec();
            if (!product) {
                return res.status(404).json((0, utilities_1.responseDto)('Product not found'));
            }
            return res.status(200).json(product);
        }
        catch (error) {
            console.error('Error fetching product details:', error);
            return res.status(500).json((0, utilities_1.responseDto)('Failed to fetch product details'));
        }
    });
}
/**
 * Get product reviews by product ID
 */
function getReviews(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json((0, utilities_1.responseDto)('Invalid product ID'));
        }
        try {
            const reviews = yield Reviews_1.default.find({
                product: new mongoose_1.default.Types.ObjectId(id),
            })
                .populate({
                path: 'customer',
                select: 'firstName lastName imageUrl',
            })
                .lean()
                .exec();
            return res.status(200).json(reviews !== null && reviews !== void 0 ? reviews : []);
        }
        catch (error) {
            console.error('Error fetching product reviews:', error);
            return res.status(500).json((0, utilities_1.responseDto)('Failed to fetch product reviews'));
        }
    });
}
