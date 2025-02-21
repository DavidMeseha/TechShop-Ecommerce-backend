"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountrySchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const countryFields = {
    name: {
        type: String,
        required: true,
        trim: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
    },
    cities: [
        {
            type: mongoose_1.default.Schema.ObjectId,
            ref: 'Cities',
            required: true,
        },
    ],
};
exports.CountrySchema = new mongoose_1.default.Schema(countryFields, {
    timestamps: true,
});
exports.CountrySchema.index({ code: 1 });
exports.CountrySchema.index({ name: 'text' });
const Countries = mongoose_1.default.models.Countries ||
    mongoose_1.default.model('Countries', exports.CountrySchema);
exports.default = Countries;
