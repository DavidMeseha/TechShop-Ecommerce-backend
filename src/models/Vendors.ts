import mongoose from "mongoose";
import { IVendor } from "../global-types";

export interface IVendorwDocument
  extends IVendor,
    mongoose.Document<unknown, any, IVendor> {}

export const VendorSchema = new mongoose.Schema<IVendorwDocument>({
  name: { type: String, required: true },
  seName: { type: String, required: true },
  imageUrl: {
    type: String,
    default: process.env.DOMAIN + "/images/profile_placeholder.jpg",
  },
  productCount: { type: Number, default: 0 },
  followersCount: { type: Number, default: 0 },
  user: { type: mongoose.Schema.ObjectId, required: true, ref: "Users" },
});

VendorSchema.index({ name: "text" });

export default (mongoose.models.Vendors as mongoose.Model<IVendor>) ||
  mongoose.model<IVendor>("Vendors", VendorSchema);
