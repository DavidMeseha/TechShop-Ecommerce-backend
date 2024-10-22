import mongoose from "mongoose";
import { ITag } from "../global-types";

export interface ITagDocument
  extends ITag,
    mongoose.Document<unknown, any, ITag> {}

export const TagSchema = new mongoose.Schema<ITagDocument>({
  name: { type: String, required: true, unique: true },
  seName: { type: String, required: true, unique: true },
  productCount: { type: Number, default: 0 },
});

export default (mongoose.models.Tags as mongoose.Model<ITag>) ||
  mongoose.model<ITag>("Tags", TagSchema);
