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
exports.checkToken = checkToken;
exports.guestToken = guestToken;
exports.login = login;
exports.register = register;
exports.logout = logout;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Users_1 = __importDefault(require("../models/Users"));
const bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
const joi_1 = __importDefault(require("joi"));
const utilities_1 = require("../utilities");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const RegisterSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    gender: joi_1.default.string().equal("male", "female", null).required(),
    password: joi_1.default.string().min(8),
    confirmPassword: joi_1.default.ref("password"),
    dayOfBirth: joi_1.default.number().integer().max(31).min(1),
    monthOfBirth: joi_1.default.number().integer().max(12).min(1),
    yearOfBirth: joi_1.default.number()
        .integer()
        .max(new Date().getFullYear())
        .min(new Date().getFullYear() - 100),
});
function checkToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (token) {
            if (!ACCESS_TOKEN_SECRET)
                return res.status(500).json((0, utilities_1.responseDto)("ENV Server Error"));
            try {
                const userToken = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
                if (!userToken)
                    return res.status(400).json((0, utilities_1.responseDto)("Token not valid"));
                const foundUser = yield Users_1.default.findById(userToken._id)
                    .select("firstName lastName imageUrl email isRegistered isLogin isVendor language")
                    .then((result) => result === null || result === void 0 ? void 0 : result.toJSON());
                if (foundUser &&
                    ((foundUser.isLogin && foundUser.isRegistered) ||
                        !foundUser.isRegistered)) {
                    res.cookie("language", foundUser.language, {
                        httpOnly: true,
                    });
                    return res.status(200).json(foundUser);
                }
                else
                    res.status(400).json((0, utilities_1.responseDto)("Token not valid"));
            }
            catch (err) {
                return res.status(400).json("Token not valid");
            }
        }
        else {
            res.status(400).json((0, utilities_1.responseDto)("No valid token provided"));
        }
    });
}
function guestToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newUser = yield Users_1.default.create({
                isRegistered: false,
                isVendor: false,
            })
                .then((user) => user.toJSON())
                .then((userJson) => {
                delete userJson.password;
                delete userJson.likes;
                delete userJson.recentProducts;
                delete userJson.saves;
                delete userJson.cart;
                return userJson;
            })
                .catch((err) => null);
            if (!newUser)
                return res
                    .status(500)
                    .json((0, utilities_1.responseDto)("guest created but ENV Server Error on creating access token"));
            if (!ACCESS_TOKEN_SECRET)
                return res
                    .status(500)
                    .json((0, utilities_1.responseDto)("guest created but ENV Server Error on creating access token"));
            jsonwebtoken_1.default.sign(Object.assign({}, newUser), ACCESS_TOKEN_SECRET, { expiresIn: "400d" }, (err, token) => {
                if (err)
                    return res.status(500).json((0, utilities_1.responseDto)("could not create token"));
                return res.status(200).json({
                    user: newUser,
                    token,
                });
            });
        }
        catch (err) {
            console.log(err);
            return res
                .status(500)
                .json((0, utilities_1.responseDto)("guest created but ENV Server Error on creating access token"));
        }
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { email, password } = req.body;
        const user = yield Users_1.default.findOne({ email: email })
            .select("_id firstName lastName email imageUrl isRegistered isVendor language password")
            .then((result) => result === null || result === void 0 ? void 0 : result.toJSON());
        if (!user)
            return res.status(401).json({ message: res.locals.t("emailNotFound") });
        const passwordMatching = bcrypt_nodejs_1.default.compareSync(password, (_a = user.password) !== null && _a !== void 0 ? _a : "");
        if (!passwordMatching)
            return res
                .status(401)
                .json({ message: res.locals.t("wrongEmailPassword") });
        if (!ACCESS_TOKEN_SECRET)
            return res
                .status(500)
                .json((0, utilities_1.responseDto)("user created but ENV Server Error"));
        delete user.password;
        jsonwebtoken_1.default.sign(Object.assign({}, user), ACCESS_TOKEN_SECRET, { expiresIn: "1d" }, (err, token) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                return res.status(500).json((0, utilities_1.responseDto)("could not create token"));
            res.cookie("language", user.language);
            res.status(200).json({ user, token });
            yield Users_1.default.updateOne({ _id: user._id }, { isLogin: true });
        }));
    });
}
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const registerForm = req.body;
        const { error, value } = RegisterSchema.validate(Object.assign({}, registerForm));
        console.log(error === null || error === void 0 ? void 0 : error.details[0]);
        if (error) {
            let message;
            if (((_a = error === null || error === void 0 ? void 0 : error.details[0].context) === null || _a === void 0 ? void 0 : _a.label) === "password")
                message = res.locals.t("passwordError");
            else if (((_b = error === null || error === void 0 ? void 0 : error.details[0].context) === null || _b === void 0 ? void 0 : _b.label) === "email")
                message = res.locals.t("emailError");
            return res.status(400).json({
                message: message,
            });
        }
        const emailDublicate = !!(yield Users_1.default.findOne({ email: value.email }));
        if (emailDublicate)
            return res.status(400).json({ message: res.locals.t("emailAlreadyUsed") });
        let newUser = yield Users_1.default.create(Object.assign(Object.assign({}, value), { isRegistered: true, isLogin: false, dateOfBirth: {
                day: value.dayOfBirth,
                month: value.monthOfBirth,
                year: value.yearOfBirth,
            } }))
            .then((user) => user.toJSON())
            .catch(() => res.status(500).json({ message: res.locals.t("serverError") }));
        if (newUser)
            res.status(200).json((0, utilities_1.responseDto)("Registerd Successfully", true));
        else
            res.status(500).json((0, utilities_1.responseDto)("Failed to create user in databse"));
    });
}
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        Users_1.default.updateOne({ _id: user._id }, { isLogin: false });
        res.status(200).json("success");
    });
}
