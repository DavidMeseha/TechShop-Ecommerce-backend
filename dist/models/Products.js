"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const supDocumentsSchema_1 = require("./supDocumentsSchema");
const ProductSchema = new mongoose_1.default.Schema({
    pictures: [
        {
            type: supDocumentsSchema_1.ImageSchema,
            default: {
                imageUrl: "",
                title: "",
                alternateText: "",
            },
        },
    ],
    price: {
        oldPrice: { type: Number, default: 0 },
        price: { type: Number, required: true },
    },
    name: { type: String, required: true },
    shortDescription: String,
    fullDescription: String,
    metaDescription: String,
    metaKeywords: String,
    metaTitle: String,
    seName: { type: String, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    hasAttributes: { type: Boolean, required: true, default: false },
    inStock: { type: Boolean, default: true },
    likes: { type: Number, default: 0 },
    carts: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    productReviewOverview: {
        ratingSum: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 },
    },
    gender: [String],
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Categories",
    },
    productReviews: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Reviews",
        },
    ],
    vendor: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Vendors",
    },
    productTags: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Tags",
        },
    ],
    productAttributes: [supDocumentsSchema_1.AttributeSchema],
}, { timestamps: true });
exports.default = mongoose_1.default.models.Products ||
    mongoose_1.default.model("Products", ProductSchema);
