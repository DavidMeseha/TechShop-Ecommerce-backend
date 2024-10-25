import mongoose from "mongoose";
import { IUser } from "./Users";
import { AttributeSchema, IAddress } from "./supDocumentsSchema";
import { IFullProduct, IProductAttribute } from "../global-types";

export interface IOrder {
  customer: IUser;
  billingStatus: string;
  billingMethod: string;
  shippingAddress: IAddress;
  shippingStatus: string;
  items: {
    product: IFullProduct;
    quantity: number;
    attributes: IProductAttribute[];
  }[];
  subTotal: number;
  totalValue: number;
  shippingFees: number;
}

export const orderSchema = new mongoose.Schema<IOrder>(
  {
    customer: { type: mongoose.Schema.ObjectId, ref: "Users" },
    billingMethod: String,
    billingStatus: String,
    shippingStatus: { type: String, default: "Processing" },
    shippingAddress: {
      address: String,
      country: { type: mongoose.Schema.ObjectId, ref: "Countries" },
      city: { type: mongoose.Schema.ObjectId, ref: "Cities" },
    },

    items: [
      {
        product: { type: mongoose.Schema.ObjectId, ref: "Products" },
        quantity: Number,
        attributes: [AttributeSchema],
      },
    ],

    shippingFees: Number,
    subTotal: Number,
    totalValue: { type: Number, required: true },
  },
  { timestamps: true }
);

export default (mongoose.models.Orders as mongoose.Model<IOrder>) ||
  mongoose.model<IOrder>("Orders", orderSchema);
