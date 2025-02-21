"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressSchema = exports.AttributeSchema = exports.ImageSchema = exports.AttributeValueSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Schema configurations
const DEFAULT_IMAGE = process.env.DOMAIN + '/images/no_image_placeholder.jpg';
const imageFields = {
    imageUrl: {
        type: String,
        default: DEFAULT_IMAGE,
    },
};
const attributeValueFields = {
    name: String,
    colorSquaresRgb: String,
    imageSquaresPicture: {
        imageUrl: String,
        title: String,
        alternateText: String,
    },
    priceAdjustmentValue: {
        type: Number,
        default: 0,
    },
};
exports.AttributeValueSchema = new mongoose_1.default.Schema(attributeValueFields);
const attributeFields = {
    name: String,
    attributeControlType: String,
    values: [exports.AttributeValueSchema],
};
const addressFields = {
    address: {
        type: String,
        required: true,
    },
    country: {
        type: mongoose_1.default.Schema.ObjectId,
        required: true,
        ref: 'Countries',
    },
    city: {
        type: mongoose_1.default.Schema.ObjectId,
        required: true,
        ref: 'Cities',
    },
};
// Schemas
exports.ImageSchema = new mongoose_1.default.Schema(imageFields);
exports.AttributeSchema = new mongoose_1.default.Schema(attributeFields);
exports.AddressSchema = new mongoose_1.default.Schema(addressFields);
