import mongoose from "mongoose";
import { ICategory } from "../global-types";

export interface ICategoryDocument
  extends ICategory,
    mongoose.Document<unknown, any, ICategory> {}

export const CategorySchema = new mongoose.Schema<ICategoryDocument>({
  name: { type: String, required: true },
  seName: { type: String, required: true },
  productsCount: { type: Number, default: 0 },
});

CategorySchema.index({ name: "text" });

export default (mongoose.models.Categories as mongoose.Model<ICategory>) ||
  mongoose.model<ICategory>("Categories", CategorySchema);
