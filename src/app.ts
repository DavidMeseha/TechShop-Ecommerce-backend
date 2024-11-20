require("dotenv").config();
import { HttpError } from "http-errors";
import express, { Request, Response, Application } from "express";
import mongoose from "mongoose";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import commonRouter from "./routes/commonRouter";
import catalogRouter from "./routes/catalogsRouter";
import productRouter from "./routes/productRouter";
import {
  apiAuthMiddleware,
  userAuthMiddleware,
} from "./middlewares/auth.middleware";
import cors from "cors";
import { VendorSchema } from "./models/Vendors";
import { CategorySchema } from "./models/Categories";
import { UserSchema } from "./models/Users";
import { ProductReviewSchema } from "./models/Reviews";
import { TagSchema } from "./models/Tags";
import { CountrySchema } from "./models/Countries";
import { CitySchema } from "./models/Cities";
import { orderSchema } from "./models/Orders";
import { getCities, getCountries } from "./controllers/common.controller";

var app: Application = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors({ origin: process.env.ORIGIN }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));
app.use("/images", express.static("../public/images"));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.ORIGIN);
  next();
});

//API Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userAuthMiddleware, userRouter);
app.use("/api/common", apiAuthMiddleware, commonRouter);
app.use("/api/catalog", catalogRouter);
app.use("/api/product", productRouter);

app.use("/api/common/countries", getCountries);
app.use("/api/common/cities/:id", getCities);

app.use("/api/status", (_req: Request, res: Response) =>
  res.status(200).json("Connected")
);

app.use("/", (req: Request, res: Response) =>
  res.redirect(process.env.ORIGIN ?? "")
);

// catch 404 and forward to error handler
app.use(function (_req: Request, res: Response) {
  if (!process.env.ORIGIN)
    return res.status(404).render("error", { to: process.env.ORIGIN });
});

// error handler
app.use(function (err: HttpError, req: Request, res: Response) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).render("error");
});

mongoose
  .connect(process.env.DB_URI ?? "")
  .then(() => {
    console.log("dbConnected");
    mongoose.model("Vendors", VendorSchema);
    mongoose.model("Categories", CategorySchema);
    mongoose.model("Users", UserSchema);
    mongoose.model("Reviews", ProductReviewSchema);
    mongoose.model("Tags", TagSchema);
    mongoose.model("Countries", CountrySchema);
    mongoose.model("Cities", CitySchema);
    mongoose.model("Orders", orderSchema);
  })
  .catch((err) => console.log(err));

app.listen(3000, () => {
  console.log("listen on 3000");
});

module.exports = app;
