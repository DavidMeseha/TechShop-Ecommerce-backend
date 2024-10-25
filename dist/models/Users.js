"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
const supDocumentsSchema_1 = require("./supDocumentsSchema");
exports.UserSchema = new mongoose_1.default.Schema({
    imageUrl: {
        type: String,
        default: process.env.DOMAIN + "/images/profile_placeholder.jpg",
    },
    firstName: {
        type: String,
        maxlength: 20,
        default: null,
    },
    lastName: {
        type: String,
        maxlength: 20,
        default: null,
    },
    email: {
        type: String,
        default: null,
    },
    password: {
        type: String,
        default: null,
    },
    cart: [
        {
            product: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Products",
            },
            quantity: Number,
            attributes: [supDocumentsSchema_1.AttributeSchema],
        },
    ],
    saves: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Products",
        },
    ],
    likes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Products",
        },
    ],
    recentProducts: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Products",
        },
    ],
    following: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Vendors",
        },
    ],
    orders: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Orders",
        },
    ],
    dateOfBirth: {
        day: Number,
        month: Number,
        year: Number,
    },
    language: { type: String, default: "en" },
    isLogin: { type: Boolean, default: false },
    isVendor: { type: Boolean, default: false },
    isRegistered: { type: Boolean, default: false },
    phone: String,
    gender: String,
    addresses: [supDocumentsSchema_1.AddressSchema],
}, { timestamps: true });
exports.UserSchema.pre("save", function (next) {
    this.password = this.password
        ? bcrypt_nodejs_1.default.hashSync(this.password, bcrypt_nodejs_1.default.genSaltSync(8))
        : null;
    next();
});
exports.default = mongoose_1.default.models.Users ||
    mongoose_1.default.model("Users", exports.UserSchema);
