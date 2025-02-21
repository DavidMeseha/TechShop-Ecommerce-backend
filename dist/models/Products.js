"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const supDocumentsSchema_1 = require("./supDocumentsSchema");
const DEFAULT_PRODUCT_IMAGE = {
    imageUrl: '',
    title: '',
    alternateText: '',
};
// Schema field groups
const basicFields = {
    name: {
        type: String,
        required: true,
        trim: true,
    },
    seName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
};
const mediaFields = {
    pictures: [
        {
            type: supDocumentsSchema_1.ImageSchema,
            default: DEFAULT_PRODUCT_IMAGE,
        },
    ],
};
const pricingFields = {
    price: {
        oldPrice: {
            type: Number,
            default: 0,
            min: 0,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
};
const metaFields = {
    fullDescription: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    metaKeywords: { type: String, trim: true },
    metaTitle: { type: String, trim: true },
};
const attributeFields = {
    hasAttributes: {
        type: Boolean,
        required: true,
        default: false,
    },
    productAttributes: [supDocumentsSchema_1.AttributeSchema],
};
const statusFields = {
    inStock: {
        type: Boolean,
        default: true,
        index: true,
    },
};
const statsFields = {
    likes: {
        type: Number,
        default: 0,
        min: 0,
    },
    carts: {
        type: Number,
        default: 0,
        min: 0,
    },
    saves: {
        type: Number,
        default: 0,
        min: 0,
    },
    productReviewOverview: {
        ratingSum: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalReviews: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
};
const relationFields = {
    gender: [{ type: String, enum: ['male', 'female', 'unisex'] }],
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Categories',
        required: true,
        index: true,
    },
    productReviews: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Reviews',
        },
    ],
    vendor: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Vendors',
        required: true,
        index: true,
    },
    productTags: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Tags',
        },
    ],
};
const productFields = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, basicFields), mediaFields), pricingFields), metaFields), attributeFields), statusFields), statsFields), relationFields);
exports.ProductSchema = new mongoose_1.default.Schema(productFields, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.ProductSchema.index({ name: 'text' });
exports.ProductSchema.index({ seName: 1 });
exports.ProductSchema.index({ sku: 1 });
exports.ProductSchema.index({ 'price.price': 1 });
const Products = mongoose_1.default.models.Products ||
    mongoose_1.default.model('Products', exports.ProductSchema);
exports.default = Products;
