import mongoose from "mongoose";
import { IFullProduct } from "../global-types";
import { AttributeSchema, ImageSchema } from "./supDocumentsSchema";

export interface IFullProductDocument extends IFullProduct, mongoose.Document {}

const DEFAULT_PRODUCT_IMAGE = {
  imageUrl: "",
  title: "",
  alternateText: "",
} as const;

// Schema field groups
const basicFields = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  seName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
};

const mediaFields = {
  pictures: [
    {
      type: ImageSchema,
      default: DEFAULT_PRODUCT_IMAGE,
    },
  ],
};

const pricingFields = {
  price: {
    oldPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
};

const metaFields = {
  fullDescription: { type: String, trim: true },
  metaDescription: { type: String, trim: true },
  metaKeywords: { type: String, trim: true },
  metaTitle: { type: String, trim: true },
};

const attributeFields = {
  hasAttributes: {
    type: Boolean,
    required: true,
    default: false,
  },
  productAttributes: [AttributeSchema],
};

const statusFields = {
  inStock: {
    type: Boolean,
    default: true,
    index: true,
  },
};

const statsFields = {
  likes: {
    type: Number,
    default: 0,
    min: 0,
  },
  carts: {
    type: Number,
    default: 0,
    min: 0,
  },
  saves: {
    type: Number,
    default: 0,
    min: 0,
  },
  productReviewOverview: {
    ratingSum: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
};

const relationFields = {
  gender: [{ type: String, enum: ["male", "female", "unisex"] }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
    required: true,
    index: true,
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
    required: true,
    index: true,
  },
  productTags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tags",
    },
  ],
};

const productFields = {
  ...basicFields,
  ...mediaFields,
  ...pricingFields,
  ...metaFields,
  ...attributeFields,
  ...statusFields,
  ...statsFields,
  ...relationFields,
};

export const ProductSchema = new mongoose.Schema<IFullProductDocument>(
  productFields,
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductSchema.index({ name: "text" });
ProductSchema.index({ seName: 1 });
ProductSchema.index({ sku: 1 });
ProductSchema.index({ "price.price": 1 });

const Products =
  (mongoose.models.Products as mongoose.Model<IFullProductDocument>) ||
  mongoose.model<IFullProductDocument>("Products", ProductSchema);

export default Products;
