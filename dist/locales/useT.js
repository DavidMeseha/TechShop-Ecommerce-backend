"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useT;
const en_json_1 = __importDefault(require("./en.json"));
const ar_json_1 = __importDefault(require("./ar.json"));
const dictionaries = {
    en: en_json_1.default,
    ar: ar_json_1.default,
};
function useT(lang) {
    const translation = Object.assign({}, dictionaries[lang]);
    return (key) => translation[key];
}
