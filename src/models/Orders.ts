import mongoose from "mongoose";
import { IUser } from "./Users";
import { AttributeSchema, IAddress } from "./supDocumentsSchema";
import { IFullProduct, IProductAttribute } from "../global-types";

export interface IOrder {
  customer: IUser;
  billing: {
    status: string;
    method: string;
    value: number;
    address: IAddress;
  };
  shipping: {
    status: string;
    method: string;
    address: IAddress;
  };
  items: {
    product: IFullProduct;
    quantity: number;
    attributes: IProductAttribute[];
  }[];
  totalValue: number;
}

export const orderSchema = new mongoose.Schema<IOrder>(
  {
    customer: { type: mongoose.Schema.ObjectId, ref: "Users" },
    billing: {
      status: { type: String, required: true },
      value: { type: Number, required: true },
      address: {
        address: String,
        country: { type: mongoose.Schema.ObjectId, ref: "Countries" },
        city: { type: mongoose.Schema.ObjectId, ref: "Cities" },
      },
    },

    shipping: {
      status: { type: String, default: "processing" },
      method: String,
      address: {
        address: String,
        country: { type: mongoose.Schema.ObjectId, ref: "Countries" },
        city: { type: mongoose.Schema.ObjectId, ref: "Cities" },
      },
    },

    items: [
      {
        product: { type: mongoose.Schema.ObjectId, ref: "Products" },
        quantity: Number,
        attributes: [AttributeSchema],
      },
    ],

    totalValue: { type: Number, required: true },
  },
  { timestamps: true }
);

export default (mongoose.models.Orders as mongoose.Model<IOrder>) ||
  mongoose.model<IOrder>("Orders", orderSchema);
