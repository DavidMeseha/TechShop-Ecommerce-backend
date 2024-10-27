"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuthMiddleware = userAuthMiddleware;
exports.apiAuthMiddleware = apiAuthMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utilities_1 = require("../utilities");
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
function userAuthMiddleware(req, res, next) {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!ACCESS_SECRET)
        return res.status(500).json((0, utilities_1.responseDto)("ENV server Error", false));
    if (!token)
        return res.status(403).json((0, utilities_1.responseDto)("Not Authorized"));
    jsonwebtoken_1.default.verify(token, ACCESS_SECRET, (err, payload) => {
        if (err || !payload)
            return res.status(403).json((0, utilities_1.responseDto)(err, false));
        const user = JSON.parse(JSON.stringify(payload));
        if (!user.isRegistered)
            return res.status(401).json((0, utilities_1.responseDto)("You Need to Signup", false));
        res.locals.user = JSON.parse(JSON.stringify(payload));
        next();
    });
}
function apiAuthMiddleware(req, res, next) {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!ACCESS_SECRET)
        return res.status(500).json((0, utilities_1.responseDto)("ENV server Error", false));
    if (!token)
        return res.status(403).json((0, utilities_1.responseDto)("Not Authorized", false));
    jsonwebtoken_1.default.verify(token, ACCESS_SECRET, (err, payload) => {
        if (err || !payload)
            return res.status(403).json((0, utilities_1.responseDto)(err, false));
        res.locals.user = JSON.parse(JSON.stringify(payload));
        next();
    });
}
