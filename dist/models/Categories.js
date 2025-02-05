"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategorySchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const categoryFields = {
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
    productsCount: {
        type: Number,
        default: 0,
        min: 0,
    },
};
exports.CategorySchema = new mongoose_1.default.Schema(categoryFields, { timestamps: true });
exports.CategorySchema.index({ name: "text" });
exports.CategorySchema.index({ seName: 1 });
const Categories = mongoose_1.default.models.Categories ||
    mongoose_1.default.model("Categories", exports.CategorySchema);
exports.default = Categories;
