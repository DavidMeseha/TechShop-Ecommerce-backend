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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const node_cron_1 = __importDefault(require("node-cron"));
// Routers
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const commonRouter_1 = __importDefault(require("./routes/commonRouter"));
const catalogsRouter_1 = __importDefault(require("./routes/catalogsRouter"));
const productRouter_1 = __importDefault(require("./routes/productRouter"));
// Middlewares
const auth_middleware_1 = require("./middlewares/auth.middleware");
// Models
const Vendors_1 = require("./models/Vendors");
const Categories_1 = require("./models/Categories");
const Users_1 = __importStar(require("./models/Users"));
const Reviews_1 = require("./models/Reviews");
const Tags_1 = require("./models/Tags");
const Countries_1 = require("./models/Countries");
const Cities_1 = require("./models/Cities");
const Orders_1 = require("./models/Orders");
// Controllers
const common_controller_1 = require("./controllers/common.controller");
// Utils
const useT_1 = __importDefault(require("./locales/useT"));
// Constants
const PORT = process.env.PORT || 3000;
const origins = ((_a = process.env.ORIGIN) === null || _a === void 0 ? void 0 : _a.split(",")) || [];
const DEFAULT_ORIGIN = (_c = (_b = process.env.ORIGIN) === null || _b === void 0 ? void 0 : _b.split(",")[0]) !== null && _c !== void 0 ? _c : "";
const configureCors = () => ({
    origin: (origin, callback) => {
        if (!origin || origins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
});
const configureMiddlewares = (app) => {
    app.use((0, cors_1.default)(configureCors()));
    app.use((0, morgan_1.default)("dev"));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
    app.use("/images", express_1.default.static("../public/images"));
};
const configureHeaders = (app) => {
    app.use((req, res, next) => {
        const origin = req.headers.origin;
        if (origins.includes(origin !== null && origin !== void 0 ? origin : "")) {
            res.setHeader("Access-Control-Allow-Origin", origin !== null && origin !== void 0 ? origin : "");
        }
        next();
    });
};
const configureLocalization = (app) => {
    app.use((req, res, next) => {
        var _a;
        res.locals.t = (0, useT_1.default)((_a = req.headers["accept-language"]) !== null && _a !== void 0 ? _a : "en");
        next();
    });
};
const configureRoutes = (app) => {
    app.use("/api/common/countries", common_controller_1.getCountries);
    app.use("/api/common/cities/:id", common_controller_1.getCities);
    app.use("/api/auth", authRouter_1.default);
    app.use("/api/user", auth_middleware_1.userAuthMiddleware, userRouter_1.default);
    app.use("/api/common", auth_middleware_1.apiAuthMiddleware, commonRouter_1.default);
    app.use("/api/catalog", catalogsRouter_1.default);
    app.use("/api/product", productRouter_1.default);
    app.use("/api/status", (_req, res) => res.status(200).json("Connected"));
    app.use("/", (_req, res) => res.redirect(DEFAULT_ORIGIN));
};
const configureErrorHandling = (app) => {
    // 404 handler
    app.use((_req, res) => {
        if (!DEFAULT_ORIGIN) {
            return res.status(404).render("error", { to: process.env.ORIGIN });
        }
    });
    // Error handler
    app.use((err, req, res) => {
        res.locals.message = err.message;
        res.locals.error = req.app.get("env") === "development" ? err : {};
        res.status(err.status || 500).render("error");
    });
};
const configureCronJobs = () => {
    // Remove users without passwords daily
    node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        const deleted = yield Users_1.default.deleteMany({ password: null });
        console.log("Expired records deleted:", deleted);
    }));
};
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        yield mongoose_1.default.connect((_a = process.env.DB_URI) !== null && _a !== void 0 ? _a : "");
        console.log("Database connected");
        // Initialize models
        mongoose_1.default.model("Vendors", Vendors_1.VendorSchema);
        mongoose_1.default.model("Categories", Categories_1.CategorySchema);
        mongoose_1.default.model("Users", Users_1.UserSchema);
        mongoose_1.default.model("Reviews", Reviews_1.ProductReviewSchema);
        mongoose_1.default.model("Tags", Tags_1.TagSchema);
        mongoose_1.default.model("Countries", Countries_1.CountrySchema);
        mongoose_1.default.model("Cities", Cities_1.CitySchema);
        mongoose_1.default.model("Orders", Orders_1.OrderSchema);
    }
    catch (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }
});
const initializeApp = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    // View engine setup
    app.set("views", path_1.default.join(__dirname, "views"));
    app.set("view engine", "ejs");
    configureMiddlewares(app);
    configureHeaders(app);
    configureLocalization(app);
    configureRoutes(app);
    configureErrorHandling(app);
    yield initializeDatabase();
    app.listen(PORT, () => {
        configureCronJobs();
        console.log(`Server listening on port ${PORT}`);
    });
    return app;
});
initializeApp();
