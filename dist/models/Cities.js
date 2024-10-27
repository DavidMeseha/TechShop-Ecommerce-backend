"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitySchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.CitySchema = new mongoose_1.default.Schema({
    code: String,
    name: String,
});
exports.default = mongoose_1.default.models.Cities ||
    mongoose_1.default.model("Cities", exports.CitySchema);
