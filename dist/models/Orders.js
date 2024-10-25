"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const supDocumentsSchema_1 = require("./supDocumentsSchema");
exports.orderSchema = new mongoose_1.default.Schema({
    customer: { type: mongoose_1.default.Schema.ObjectId, ref: "Users" },
    billingMethod: String,
    billingStatus: String,
    shippingStatus: { type: String, default: "Processing" },
    shippingAddress: {
        address: String,
        country: { type: mongoose_1.default.Schema.ObjectId, ref: "Countries" },
        city: { type: mongoose_1.default.Schema.ObjectId, ref: "Cities" },
    },
    items: [
        {
            product: { type: mongoose_1.default.Schema.ObjectId, ref: "Products" },
            quantity: Number,
            attributes: [supDocumentsSchema_1.AttributeSchema],
        },
    ],
    shippingFees: Number,
    subTotal: Number,
    totalValue: { type: Number, required: true },
}, { timestamps: true });
exports.default = mongoose_1.default.models.Orders ||
    mongoose_1.default.model("Orders", exports.orderSchema);
