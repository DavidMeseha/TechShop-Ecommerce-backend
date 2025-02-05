import mongoose from "mongoose";
import {
  IPicture,
  IProductAttribute,
  IProductAttributeValue,
} from "../global-types";
import { ICity } from "./Cities";
import { ICountry } from "./Countries";

// Document interfaces
export interface IPictureDocument extends IPicture, mongoose.Document {}
export interface IProductAttributeValueDocument
  extends IProductAttributeValue,
    mongoose.Document {}
export interface IProductAttributeDocument
  extends IProductAttribute,
    mongoose.Document {}
export interface IAddress {
  address: string;
  city: ICity;
  country: ICountry;
}

// Schema configurations
const DEFAULT_IMAGE = process.env.DOMAIN + "/images/no_image_placeholder.jpg";

const imageFields = {
  imageUrl: {
    type: String,
    default: DEFAULT_IMAGE,
  },
};

const attributeValueFields = {
  name: String,
  colorSquaresRgb: String,
  imageSquaresPicture: {
    imageUrl: String,
    title: String,
    alternateText: String,
  },
  priceAdjustmentValue: {
    type: Number,
    default: 0,
  },
};

export const AttributeValueSchema =
  new mongoose.Schema<IProductAttributeValueDocument>(attributeValueFields);

const attributeFields = {
  name: String,
  attributeControlType: String,
  values: [AttributeValueSchema],
};

const addressFields = {
  address: {
    type: String,
    required: true,
  },
  country: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Countries",
  },
  city: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Cities",
  },
};

// Schemas
export const ImageSchema = new mongoose.Schema<IPictureDocument>(imageFields);
export const AttributeSchema = new mongoose.Schema<IProductAttributeDocument>(
  attributeFields
);
export const AddressSchema = new mongoose.Schema<IAddress>(addressFields);
