import mongoose from "mongoose";

export interface ICity {
  name: string;
  code: string;
}

export const CitySchema = new mongoose.Schema<ICity>({
  code: String,
  name: String,
});

export default (mongoose.models.Cities as mongoose.Model<ICity>) ||
  mongoose.model<ICity>("Cities", CitySchema);
