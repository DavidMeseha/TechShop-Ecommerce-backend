import mongoose from 'mongoose';
import { ICountry } from '@/types/general';

export interface ICountryDocument extends Omit<ICountry, '_id'>, mongoose.Document {}

const countryFields = {
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
  cities: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Cities',
      required: true,
    },
  ],
};

export const CountrySchema = new mongoose.Schema<ICountryDocument>(countryFields, {
  timestamps: true,
});

CountrySchema.index({ code: 1 });
CountrySchema.index({ name: 'text' });

const Countries =
  (mongoose.models.Countries as mongoose.Model<ICountryDocument>) ||
  mongoose.model<ICountryDocument>('Countries', CountrySchema);

export default Countries;
