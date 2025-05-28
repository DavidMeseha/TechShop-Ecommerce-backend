import mongoose from 'mongoose';
import { ICategory } from '@/types/product.interface';

export interface ICategoryDocument extends Omit<ICategory, '_id'>, mongoose.Document {}

const categoryFields = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  seName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  productsCount: {
    type: Number,
    default: 0,
    min: 0,
  },
};

export const CategorySchema = new mongoose.Schema<ICategoryDocument>(categoryFields, {
  timestamps: true,
});

CategorySchema.index({ name: 'text' });
CategorySchema.index({ seName: 1 });

const Categories =
  (mongoose.models.Categories as mongoose.Model<ICategoryDocument>) ||
  mongoose.model<ICategoryDocument>('Categories', CategorySchema);

export default Categories;
