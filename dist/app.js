"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const commonRouter_1 = __importDefault(require("./routes/commonRouter"));
const catalogsRouter_1 = __importDefault(require("./routes/catalogsRouter"));
const productRouter_1 = __importDefault(require("./routes/productRouter"));
const auth_middleware_1 = require("./middlewares/auth.middleware");
const cors_1 = __importDefault(require("cors"));
const Vendors_1 = require("./models/Vendors");
const Categories_1 = require("./models/Categories");
const Users_1 = __importStar(require("./models/Users"));
const Reviews_1 = require("./models/Reviews");
const Tags_1 = require("./models/Tags");
const Countries_1 = require("./models/Countries");
const Cities_1 = require("./models/Cities");
const Orders_1 = require("./models/Orders");
const common_controller_1 = require("./controllers/common.controller");
const useT_1 = __importDefault(require("./locales/useT"));
const node_cron_1 = __importDefault(require("node-cron"));
const origins = ((_a = process.env.ORIGIN) === null || _a === void 0 ? void 0 : _a.split(",")) || [];
var app = (0, express_1.default)();
// view engine setup
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (origins.indexOf(origin) !== -1) {
            callback(null, true); // Allow the request
        }
        else {
            callback(new Error("Not allowed by CORS")); // Reject the request
        }
    },
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use("/images", express_1.default.static("../public/images"));
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origins.includes(origin !== null && origin !== void 0 ? origin : "")) {
        res.setHeader("Access-Control-Allow-Origin", origin !== null && origin !== void 0 ? origin : "");
    }
    next();
});
app.use((req, res, next) => {
    var _a;
    res.locals.t = (0, useT_1.default)((_a = req.headers["accept-language"]) !== null && _a !== void 0 ? _a : "en");
    next();
});
//API Routes
app.use("/api/common/countries", common_controller_1.getCountries);
app.use("/api/common/cities/:id", common_controller_1.getCities);
app.use("/api/auth", authRouter_1.default);
app.use("/api/user", auth_middleware_1.userAuthMiddleware, userRouter_1.default);
app.use("/api/common", auth_middleware_1.apiAuthMiddleware, commonRouter_1.default);
app.use("/api/catalog", catalogsRouter_1.default);
app.use("/api/product", productRouter_1.default);
app.use("/api/status", (_req, res) => res.status(200).json("Connected"));
app.use("/", (req, res) => { var _a; return res.redirect((_a = process.env.ORIGIN) !== null && _a !== void 0 ? _a : ""); });
// catch 404 and forward to error handler
app.use(function (_req, res) {
    var _a;
    if (!((_a = process.env.ORIGIN) === null || _a === void 0 ? void 0 : _a.split(",")[0]))
        return res.status(404).render("error", { to: process.env.ORIGIN });
});
// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500).render("error");
});
mongoose_1.default
    .connect((_b = process.env.DB_URI) !== null && _b !== void 0 ? _b : "")
    .then(() => {
    console.log("dbConnected");
    mongoose_1.default.model("Vendors", Vendors_1.VendorSchema);
    mongoose_1.default.model("Categories", Categories_1.CategorySchema);
    mongoose_1.default.model("Users", Users_1.UserSchema);
    mongoose_1.default.model("Reviews", Reviews_1.ProductReviewSchema);
    mongoose_1.default.model("Tags", Tags_1.TagSchema);
    mongoose_1.default.model("Countries", Countries_1.CountrySchema);
    mongoose_1.default.model("Cities", Cities_1.CitySchema);
    mongoose_1.default.model("Orders", Orders_1.orderSchema);
})
    .catch((err) => console.log(err));
app.listen(3000, () => {
    // Schedule a task to run every day (removing every user without password)
    node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        const del = yield Users_1.default.deleteMany({
            password: null,
        });
        console.log("Expired records deleted " + del);
    }));
    console.log("listen on 3000");
});
module.exports = app;
