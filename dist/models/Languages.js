"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const languageFields = {
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        enum: ['en', 'ar', 'fr'], // Match supported languages from useT.ts
        lowercase: true,
    },
};
exports.LanguageSchema = new mongoose_1.default.Schema(languageFields, {
    timestamps: true,
});
exports.LanguageSchema.index({ name: 1 });
const Languages = mongoose_1.default.models.Languages ||
    mongoose_1.default.model('Languages', exports.LanguageSchema);
exports.default = Languages;
