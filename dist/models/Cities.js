"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitySchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cityFields = {
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
};
exports.CitySchema = new mongoose_1.default.Schema(cityFields, {
    timestamps: true,
});
exports.CitySchema.index({ code: 1 });
exports.CitySchema.index({ name: 'text' });
const Cities = mongoose_1.default.models.Cities ||
    mongoose_1.default.model('Cities', exports.CitySchema);
exports.default = Cities;
