"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const blob_1 = require("@vercel/blob");
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).json({ message: "No file provided" });
    }
    try {
        const file = req.file;
        const blob = yield (0, blob_1.put)(file.originalname, file.buffer, {
            access: "public",
            token: process.env.FILES_READ_WRITE_TOKEN
        });
        return res.status(200).json({ imageUrl: blob.url });
    }
    catch (error) {
        console.error("File upload error:", error);
        return res.status(500).json({ message: "Failed to upload file" });
    }
});
exports.uploadImage = uploadImage;
