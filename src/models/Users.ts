import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";
import { IFullProduct, IProductAttribute, IVendor } from "../global-types";
import { AddressSchema, AttributeSchema, IAddress } from "./supDocumentsSchema";
import { IOrder } from "./Orders";
export interface IUser {
  imageUrl?: string;
  lastName?: string;
  firstName?: string;
  isLogin?: boolean;
  isRegistered?: boolean;
  isVendor?: boolean;
  email?: string;
  password?: string | null;
  saves?: IFullProduct[];
  likes?: IFullProduct[];
  following: IVendor[];
  recentProducts?: IFullProduct[];
  gender?: string;
  language?: string;
  dateOfBirth?: { day: number; month: number; year: number } | null;
  phone: string;
  cart?: {
    product: IFullProduct;
    quantity: number;
    attributes: IProductAttribute[];
  }[];
  addresses: IAddress[];
  orders: IOrder[];
}

export interface IUserDocument extends IUser {}

export const UserSchema = new mongoose.Schema<IUserDocument>(
  {
    imageUrl: {
      type: String,
      default: process.env.DOMAIN + "/images/profile_placeholder.jpg",
    },
    firstName: {
      type: String,
      maxlength: 20,
      default: null,
    },
    lastName: {
      type: String,
      maxlength: 20,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
        },
        quantity: Number,
        attributes: [AttributeSchema],
      },
    ],
    saves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
    ],
    recentProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendors",
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orders",
      },
    ],
    dateOfBirth: {
      day: Number,
      month: Number,
      year: Number,
    },
    language: { type: String, default: "en" },
    isLogin: { type: Boolean, default: false },
    isVendor: { type: Boolean, default: false },
    isRegistered: { type: Boolean, default: false },
    phone: String,
    gender: String,
    addresses: [AddressSchema],
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  this.password = this.password
    ? bcrypt.hashSync(this.password, bcrypt.genSaltSync(8))
    : null;

  next();
});

export default (mongoose.models.Users as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("Users", UserSchema);
