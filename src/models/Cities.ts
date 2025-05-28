import mongoose from 'mongoose';
import { ICity } from '@/types/general';

export interface ICityDocument extends Omit<ICity, '_id'>, mongoose.Document {}

const cityFields = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
};

export const CitySchema = new mongoose.Schema<ICityDocument>(cityFields, {
  timestamps: true,
});

CitySchema.index({ code: 1 });
CitySchema.index({ name: 'text' });

const Cities =
  (mongoose.models.Cities as mongoose.Model<ICityDocument>) ||
  mongoose.model<ICityDocument>('Cities', CitySchema);

export default Cities;
