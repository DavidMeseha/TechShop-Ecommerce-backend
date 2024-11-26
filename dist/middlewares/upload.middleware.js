"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// import path from "path";
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/images");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
const storage = multer_1.default.memoryStorage();
exports.default = (0, multer_1.default)({ storage: storage });
