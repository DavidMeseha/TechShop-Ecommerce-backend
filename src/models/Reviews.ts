import mongoose from "mongoose";
import { IProductReview } from "../global-types";

export interface IProductReviewDocument
  extends IProductReview,
    mongoose.Document<unknown, any, IProductReview> {}

export const ProductReviewSchema = new mongoose.Schema<IProductReviewDocument>(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    reviewText: String,
    rating: Number,
  },
  {
    timestamps: true,
  }
);

export default (mongoose.models.Reviews as mongoose.Model<IProductReview>) ||
  mongoose.model<IProductReview>("Reviews", ProductReviewSchema);
