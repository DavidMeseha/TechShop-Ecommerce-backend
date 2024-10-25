"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.TagSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    seName: { type: String, required: true, unique: true },
    productCount: { type: Number, default: 0 },
});
exports.default = mongoose_1.default.models.Tags ||
    mongoose_1.default.model("Tags", exports.TagSchema);
