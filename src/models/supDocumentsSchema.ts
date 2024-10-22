import mongoose from "mongoose";
import {
  IPicture,
  IProductAttribute,
  IProductAttributeValue,
} from "../global-types";
import { ICity } from "./Cities";
import { ICountry } from "./Countries";

interface IPictureDocument
  extends IPicture,
    mongoose.Document<unknown, any, IPicture> {}
export const ImageSchema = new mongoose.Schema<IPictureDocument>({
  imageUrl: {
    type: String,
    default: process.env.DOMAIN + "/images/no_image_placeholder.jpg",
  },
  title: { type: String, default: "" },
  alternateText: { type: String, default: "" },
});

interface IProductAttributeValueDocument
  extends IProductAttributeValue,
    mongoose.Document<unknown, any, IProductAttributeValue> {}
export const AttributeValueSchema =
  new mongoose.Schema<IProductAttributeValueDocument>({
    name: String,
    colorSquaresRgb: String,
    imageSquaresPicture: {
      imageUrl: String,
      title: String,
      alternateText: String,
    },
    priceAdjustmentValue: { type: Number, default: 0 },
  });

interface IProductAttributeDocument
  extends IProductAttribute,
    mongoose.Document<unknown, any, IProductAttribute> {}
export const AttributeSchema = new mongoose.Schema<IProductAttributeDocument>({
  name: String,
  attributeControlType: String,
  values: [AttributeValueSchema],
});

export interface IAddress {
  address: string;
  city: ICity;
  country: ICountry;
}

export const AddressSchema = new mongoose.Schema<IAddress>({
  address: { type: String, required: true },
  country: { type: mongoose.Schema.ObjectId, required: true, ref: "Countries" },
  city: { type: mongoose.Schema.ObjectId, required: true, ref: "Cities" },
});
