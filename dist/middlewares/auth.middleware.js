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
exports.userAuthMiddleware = userAuthMiddleware;
exports.apiAuthMiddleware = apiAuthMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utilities_1 = require("../utilities");
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const verifyToken = (token) => {
    if (!ACCESS_SECRET) {
        throw new Error("ENV server Error");
    }
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, ACCESS_SECRET, (err, payload) => {
            if (err || !payload) {
                reject(err);
            }
            resolve(payload);
        });
    });
};
const extractToken = (req) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        throw new Error("Not Authorized");
    }
    return token;
};
function userAuthMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = extractToken(req);
            const payload = yield verifyToken(token);
            const user = JSON.parse(JSON.stringify(payload));
            if (!user.isRegistered) {
                return res.status(401).json((0, utilities_1.responseDto)("You Need to Signup", false));
            }
            res.locals.user = user;
            next();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Authentication Error";
            if (message === "ENV server Error") {
                return res.status(500).json((0, utilities_1.responseDto)(message, false));
            }
            return res.status(403).json((0, utilities_1.responseDto)(message, false));
        }
    });
}
function apiAuthMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = extractToken(req);
            const payload = yield verifyToken(token);
            res.locals.user = JSON.parse(JSON.stringify(payload));
            next();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Authentication Error";
            if (message === "ENV server Error") {
                return res.status(500).json((0, utilities_1.responseDto)(message, false));
            }
            return res.status(403).json((0, utilities_1.responseDto)(message, false));
        }
    });
}
