"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductReviewSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const reviewFields = {
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Products",
        required: true,
    },
    customer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    reviewText: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
};
exports.ProductReviewSchema = new mongoose_1.default.Schema(reviewFields, { timestamps: true });
const Reviews = mongoose_1.default.models.Reviews ||
    mongoose_1.default.model("Reviews", exports.ProductReviewSchema);
exports.default = Reviews;
