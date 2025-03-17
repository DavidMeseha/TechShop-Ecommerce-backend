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
const Users_1 = __importDefault(require("../models/Users"));
function findUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return Users_1.default.findById(id)
            .select('firstName lastName imageUrl email isRegistered isLogin isVendor language')
            .then((user) => (user === null || user === void 0 ? void 0 : user.toJSON()) || null);
    });
}
function findUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return Users_1.default.findOne({ email }).then((user) => (user === null || user === void 0 ? void 0 : user.toJSON()) || null);
    });
}
function createGuestUser() {
    return __awaiter(this, void 0, void 0, function* () {
        return Users_1.default.create({
            isRegistered: false,
            isVendor: false,
        }).then((user) => user.toJSON());
    });
}
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return Users_1.default.create(user).then((user) => user.toJSON());
    });
}
function logout(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Users_1.default.updateOne({ _id: id }, { isLogin: false });
    });
}
exports.default = {
    logout,
    createUser,
    createGuestUser,
    findUserByEmail,
    findUserById,
};
