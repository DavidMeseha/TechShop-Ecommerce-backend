"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const http_errors_1 = __importDefault(require("http-errors"));
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
const Users_1 = require("./models/Users");
const Reviews_1 = require("./models/Reviews");
const Tags_1 = require("./models/Tags");
const Countries_1 = require("./models/Countries");
const Cities_1 = require("./models/Cities");
const Orders_1 = require("./models/Orders");
var app = (0, express_1.default)();
// view engine setup
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use((0, cors_1.default)({ origin: process.env.ORIGIN }));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use("/images", express_1.default.static("../public/images"));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.ORIGIN);
    next();
});
//API Routes
app.use("/api/auth", authRouter_1.default);
app.use("/api/user", auth_middleware_1.userAuthMiddleware, userRouter_1.default);
app.use("/api/common", auth_middleware_1.apiAuthMiddleware, commonRouter_1.default);
app.use("/api/catalog", auth_middleware_1.apiAuthMiddleware, catalogsRouter_1.default);
app.use("/api/product", auth_middleware_1.apiAuthMiddleware, productRouter_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
mongoose_1.default
    .connect((_a = process.env.DB_URI) !== null && _a !== void 0 ? _a : "")
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
    .catch((err) => {
    console.log(err);
});
app.listen(3000, () => {
    console.log("listen on 3000");
});
module.exports = app;
