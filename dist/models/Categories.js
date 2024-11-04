"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategorySchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.CategorySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    seName: { type: String, required: true },
    productsCount: { type: Number, default: 0 },
});
exports.CategorySchema.index({ name: "text" });
exports.default = mongoose_1.default.models.Categories ||
    mongoose_1.default.model("Categories", exports.CategorySchema);
