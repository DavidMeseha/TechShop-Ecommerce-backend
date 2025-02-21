import mongoose from 'mongoose';
import { ITag } from '../interfaces/product.interface';

export interface ITagDocument extends ITag, mongoose.Document {}

const tagFields = {
  name: {
    type: String,
    required: true,
    unique: true,
  },
  seName: {
    type: String,
    required: true,
    unique: true,
  },
  productCount: {
    type: Number,
    default: 0,
  },
};

export const TagSchema = new mongoose.Schema<ITagDocument>(tagFields);

TagSchema.index({ name: 'text' });

const Tags =
  (mongoose.models.Tags as mongoose.Model<ITagDocument>) ||
  mongoose.model<ITagDocument>('Tags', TagSchema);

export default Tags;
