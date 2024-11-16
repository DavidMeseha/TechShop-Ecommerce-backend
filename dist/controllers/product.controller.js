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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductAtterputes = getProductAtterputes;
exports.getProductDetails = getProductDetails;
exports.getReviews = getReviews;
const Products_1 = __importDefault(require("../models/Products"));
const utilities_1 = require("../utilities");
const mongoose_1 = __importDefault(require("mongoose"));
const Reviews_1 = __importDefault(require("../models/Reviews"));
function getProductAtterputes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            const product = yield Products_1.default.findById(id)
                .select("productAttributes name")
                .lean()
                .exec();
            res.status(200).json(product);
        }
        catch (err) {
            res.status(400).json((0, utilities_1.responseDto)(err.message));
        }
    });
}
function getProductDetails(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            const product = yield Products_1.default.findById(id)
                .populate("vendor")
                .select("-productReviews")
                .lean()
                .exec();
            if (!product)
                return res.status(404).json((0, utilities_1.responseDto)("No product found"));
            res.status(200).json(product);
        }
        catch (err) {
            res.status(400).json((0, utilities_1.responseDto)(err.message));
        }
    });
}
function getReviews(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            const reviews = yield Reviews_1.default.find({
                product: new mongoose_1.default.Types.ObjectId(id),
            })
                .populate({ path: "customer", select: "firstName lastName imageUrl" })
                .lean()
                .exec();
            res.status(200).json(reviews !== null && reviews !== void 0 ? reviews : []);
        }
        catch (err) {
            res.status(400).json((0, utilities_1.responseDto)(err.message));
        }
    });
}
