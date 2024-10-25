"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.LanguageSchema = new mongoose_1.default.Schema({
    // _id: mongoose.Types.ObjectId,
    name: { type: String, required: true },
});
exports.default = mongoose_1.default.models.Languages ||
    mongoose_1.default.model("Languages", exports.LanguageSchema);
