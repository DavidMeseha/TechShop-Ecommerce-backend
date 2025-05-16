import mongoose from 'mongoose';
import { IVendor } from '../interfaces/product.interface';
import { DEFAULT_PROFILE_IMAGE } from '../config/env.config';

export interface IVendorDocument extends IVendor, mongoose.Document {}

const vendorFields = {
  name: {
    type: String,
    required: true,
  },
  seName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: DEFAULT_PROFILE_IMAGE,
  },
  productCount: {
    type: Number,
    default: 0,
  },
  followersCount: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Users',
  },
  usersFollowed: [
    {
      type: String,
    },
  ],
};

export const VendorSchema = new mongoose.Schema<IVendorDocument>(vendorFields);

VendorSchema.index({ name: 'text' });

const Vendors =
  (mongoose.models.Vendors as mongoose.Model<IVendorDocument>) ||
  mongoose.model<IVendorDocument>('Vendors', VendorSchema);

export default Vendors;
