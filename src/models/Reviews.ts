import mongoose from "mongoose";
import { IProductReview } from "../global-types";

export interface IProductReviewDocument
  extends IProductReview,
    mongoose.Document {}

const reviewFields = {
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  reviewText: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
};

export const ProductReviewSchema = new mongoose.Schema<IProductReviewDocument>(
  reviewFields,
  { timestamps: true }
);

const Reviews =
  (mongoose.models.Reviews as mongoose.Model<IProductReviewDocument>) ||
  mongoose.model<IProductReviewDocument>("Reviews", ProductReviewSchema);

export default Reviews;
