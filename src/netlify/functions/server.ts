import express from "express";
import serverless from "serverless-http";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "../../routes/authRouter";
import catalogsRouter from "../../routes/catalogsRouter";
import commonRouter from "../../routes/commonRouter";
import productRouter from "../../routes/productRouter";
import userRouter from "../../routes/userRouter";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/shop")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/catalogs", catalogsRouter);
app.use("/api/common", commonRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);

// Error handling
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something broke!" });
  }
);

// Export handler for serverless
export const handler = serverless(app);
