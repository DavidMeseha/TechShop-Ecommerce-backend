import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import { AddressSchema, AttributeSchema } from './supDocumentsSchema';
import { IUser } from '../interfaces/user.interface';

export interface IUserDocument extends IUser, mongoose.Document {
  comparePassword(candidatePassword: string): boolean;
}

const DEFAULT_PROFILE_IMAGE = process.env.DOMAIN + '/images/profile_placeholder.jpg';

const userProfileFields = {
  imageUrl: {
    type: String,
    default: DEFAULT_PROFILE_IMAGE,
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
  phone: String,
  gender: String,
  dateOfBirth: {
    day: Number,
    month: Number,
    year: Number,
  },
};

const userPreferences = {
  language: {
    type: String,
    default: 'en',
  },
};

const userStatusFlags = {
  isLogin: {
    type: Boolean,
    default: false,
  },
  isVendor: {
    type: Boolean,
    default: false,
  },
  isRegistered: {
    type: Boolean,
    default: false,
  },
};

const userCollections = {
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
      },
      quantity: Number,
      attributes: [AttributeSchema],
    },
  ],
  saves: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products',
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products',
    },
  ],
  recentProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products',
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendors',
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Orders',
    },
  ],
  addresses: [AddressSchema],
};

export const UserSchema = new mongoose.Schema<IUserDocument>(
  {
    ...userProfileFields,
    ...userPreferences,
    ...userStatusFlags,
    ...userCollections,
  },
  { timestamps: true }
);

UserSchema.pre('save', function (next) {
  if (this.password) {
    const salt = bcrypt.genSaltSync(8);
    this.password = bcrypt.hashSync(this.password, salt);
  }
  next();
});

UserSchema.methods.comparePassword = function (candidatePassword: string): boolean {
  return bcrypt.compareSync(candidatePassword, this.password || '');
};

const Users =
  (mongoose.models.Users as mongoose.Model<IUserDocument>) ||
  mongoose.model<IUserDocument>('Users', UserSchema);

export default Users;
