import mongoose from 'mongoose';
import { DEFAULT_IMAGE } from '@/config/env.config';
import { IPicture, IProductAttribute, IProductAttributeValue } from '@/types/product.interface';
import { IAddress } from '@/types/user.interface';

// Document interfaces
interface IPictureDocument extends Omit<IPicture, '_id'>, mongoose.Document {}
interface IProductAttributeValueDocument
  extends Omit<IProductAttributeValue, '_id'>,
    mongoose.Document {}

interface IProductAttributeDocument extends Omit<IProductAttribute, '_id'>, mongoose.Document {}
interface IAddressDocument extends Omit<IAddress, '_id'>, mongoose.Document {}

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

export const AttributeValueSchema = new mongoose.Schema<IProductAttributeValueDocument>(
  attributeValueFields
);

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
    ref: 'Countries',
  },
  city: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Cities',
  },
};

// Schemas
export const ImageSchema = new mongoose.Schema<IPictureDocument>(imageFields);
export const AttributeSchema = new mongoose.Schema<IProductAttributeDocument>(attributeFields);
export const AddressSchema = new mongoose.Schema<IAddressDocument>(addressFields);
