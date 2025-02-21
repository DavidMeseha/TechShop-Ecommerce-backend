import mongoose from 'mongoose';
import { IVendor } from '../interfaces/Product.interface';

export interface IVendorDocument extends IVendor, mongoose.Document {}

const DEFAULT_PROFILE_IMAGE = process.env.DOMAIN + '/images/profile_placeholder.jpg';

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
};

export const VendorSchema = new mongoose.Schema<IVendorDocument>(vendorFields);

VendorSchema.index({ name: 'text' });

const Vendors =
  (mongoose.models.Vendors as mongoose.Model<IVendorDocument>) ||
  mongoose.model<IVendorDocument>('Vendors', VendorSchema);

export default Vendors;
