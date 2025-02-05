import mongoose from "mongoose";

export interface ILanguage {
  name: string;
}

export interface ILanguageDocument extends ILanguage, mongoose.Document {}

const languageFields = {
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    enum: ["en", "ar", "fr"], // Match supported languages from useT.ts
    lowercase: true,
  },
};

export const LanguageSchema = new mongoose.Schema<ILanguageDocument>(
  languageFields,
  { timestamps: true }
);

LanguageSchema.index({ name: 1 });

const Languages =
  (mongoose.models.Languages as mongoose.Model<ILanguageDocument>) ||
  mongoose.model<ILanguageDocument>("Languages", LanguageSchema);

export default Languages;
