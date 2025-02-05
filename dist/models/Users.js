"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
const supDocumentsSchema_1 = require("./supDocumentsSchema");
const DEFAULT_PROFILE_IMAGE = process.env.DOMAIN + "/images/profile_placeholder.jpg";
const userProfileFields = {
    imageUrl: {
        type: String,
        default: DEFAULT_PROFILE_IMAGE,
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
    phone: String,
    gender: String,
    dateOfBirth: {
        day: Number,
        month: Number,
        year: Number,
    },
};
const userPreferences = {
    language: {
        type: String,
        default: "en",
    },
};
const userStatusFlags = {
    isLogin: {
        type: Boolean,
        default: false,
    },
    isVendor: {
        type: Boolean,
        default: false,
    },
    isRegistered: {
        type: Boolean,
        default: false,
    },
};
const userCollections = {
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
    addresses: [supDocumentsSchema_1.AddressSchema],
};
exports.UserSchema = new mongoose_1.default.Schema(Object.assign(Object.assign(Object.assign(Object.assign({}, userProfileFields), userPreferences), userStatusFlags), userCollections), { timestamps: true });
exports.UserSchema.pre("save", function (next) {
    if (this.password) {
        const salt = bcrypt_nodejs_1.default.genSaltSync(8);
        this.password = bcrypt_nodejs_1.default.hashSync(this.password, salt);
    }
    next();
});
exports.UserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt_nodejs_1.default.compareSync(candidatePassword, this.password || "");
};
const Users = mongoose_1.default.models.Users ||
    mongoose_1.default.model("Users", exports.UserSchema);
exports.default = Users;
