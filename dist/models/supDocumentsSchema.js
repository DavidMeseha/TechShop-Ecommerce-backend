"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressSchema = exports.AttributeSchema = exports.AttributeValueSchema = exports.ImageSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.ImageSchema = new mongoose_1.default.Schema({
    imageUrl: {
        type: String,
        default: process.env.DOMAIN + "/images/no_image_placeholder.jpg",
    },
    title: { type: String, default: "" },
    alternateText: { type: String, default: "" },
});
exports.AttributeValueSchema = new mongoose_1.default.Schema({
    name: String,
    colorSquaresRgb: String,
    imageSquaresPicture: {
        imageUrl: String,
        title: String,
        alternateText: String,
    },
    priceAdjustmentValue: { type: Number, default: 0 },
});
exports.AttributeSchema = new mongoose_1.default.Schema({
    name: String,
    attributeControlType: String,
    values: [exports.AttributeValueSchema],
});
exports.AddressSchema = new mongoose_1.default.Schema({
    address: { type: String, required: true },
    country: { type: mongoose_1.default.Schema.ObjectId, required: true, ref: "Countries" },
    city: { type: mongoose_1.default.Schema.ObjectId, required: true, ref: "Cities" },
});
