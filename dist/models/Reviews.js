"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductReviewSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.ProductReviewSchema = new mongoose_1.default.Schema({
    product: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Products" },
    customer: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Users" },
    reviewText: String,
    rating: Number,
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.models.Reviews ||
    mongoose_1.default.model("Reviews", exports.ProductReviewSchema);
