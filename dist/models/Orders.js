"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const supDocumentsSchema_1 = require("./supDocumentsSchema");
const orderItemFields = {
    product: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "Products",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    attributes: [supDocumentsSchema_1.AttributeSchema],
};
const shippingFields = {
    shippingStatus: {
        type: String,
        default: "Processing",
        enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    },
    shippingAddress: {
        address: {
            type: String,
            required: true,
        },
        country: {
            type: mongoose_1.default.Schema.ObjectId,
            ref: "Countries",
            required: true,
        },
        city: {
            type: mongoose_1.default.Schema.ObjectId,
            ref: "Cities",
            required: true,
        },
    },
    shippingFees: {
        type: Number,
        required: true,
        min: 0,
    },
};
const billingFields = {
    billingMethod: {
        type: String,
        required: true,
        enum: ["card", "cod", "paypal"],
    },
    billingStatus: {
        type: String,
        required: true,
        enum: ["pending", "paid", "failed"],
    },
};
const priceFields = {
    subTotal: {
        type: Number,
        required: true,
        min: 0,
    },
    totalValue: {
        type: Number,
        required: true,
        min: 0,
    },
};
const orderFields = Object.assign(Object.assign(Object.assign({ customer: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "Users",
        required: true,
        index: true,
    }, items: [orderItemFields] }, shippingFields), billingFields), priceFields);
exports.OrderSchema = new mongoose_1.default.Schema(orderFields, {
    timestamps: true,
});
exports.OrderSchema.index({ shippingStatus: 1 });
exports.OrderSchema.index({ billingStatus: 1 });
exports.OrderSchema.index({ createdAt: -1 });
const Orders = mongoose_1.default.models.Orders ||
    mongoose_1.default.model("Orders", exports.OrderSchema);
exports.default = Orders;
