import mongoose from "mongoose";

export interface ILanguage {
  name: string;
}

export interface ILanguageDocument extends ILanguage, mongoose.Document {}

export const LanguageSchema = new mongoose.Schema<ILanguageDocument>({
  // _id: mongoose.Types.ObjectId,
  name: { type: String, required: true },
});

export default (mongoose.models.Languages as mongoose.Model<ILanguage>) ||
  mongoose.model<ILanguage>("Languages", LanguageSchema);
