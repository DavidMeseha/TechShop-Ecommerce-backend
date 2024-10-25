"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountrySchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.CountrySchema = new mongoose_1.default.Schema({
    code: String,
    name: String,
    cities: [
        {
            type: mongoose_1.default.Schema.ObjectId,
            ref: "Cities",
        },
    ],
});
exports.default = mongoose_1.default.models.Countries ||
    mongoose_1.default.model("Countries", exports.CountrySchema);
