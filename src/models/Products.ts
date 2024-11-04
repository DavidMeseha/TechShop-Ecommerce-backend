import mongoose from "mongoose";
import { IFullProduct } from "../global-types";
import { AttributeSchema, ImageSchema } from "./supDocumentsSchema";

interface IFullProductDocument
  extends IFullProduct,
    mongoose.Document<unknown, any, IFullProduct> {}

const ProductSchema = new mongoose.Schema<IFullProductDocument>(
  {
    pictures: [
      {
        type: ImageSchema,
        default: {
          imageUrl: "",
          title: "",
          alternateText: "",
        },
      },
    ],
    price: {
      oldPrice: { type: Number, default: 0 },
      price: { type: Number, required: true },
    },
    name: { type: String, required: true },
    fullDescription: String,
    metaDescription: String,
    metaKeywords: String,
    metaTitle: String,
    seName: { type: String, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    hasAttributes: { type: Boolean, required: true, default: false },
    inStock: { type: Boolean, default: true },
    likes: { type: Number, default: 0 },
    carts: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    productReviewOverview: {
      ratingSum: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
    },
    gender: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
    },
    productReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews",
      },
    ],
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendors",
    },
    productTags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tags",
      },
    ],
    productAttributes: [AttributeSchema],
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text" });

export default (mongoose.models.Products as mongoose.Model<IFullProduct>) ||
  mongoose.model<IFullProduct>("Products", ProductSchema);
