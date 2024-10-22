import mongoose from "mongoose";
import { ICity } from "./Cities";

export interface ICountry {
  name: string;
  code: string;
  cities: ICity[];
}

export const CountrySchema = new mongoose.Schema<ICountry>({
  code: String,
  name: String,
  cities: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Cities",
    },
  ],
});

export default (mongoose.models.Countries as mongoose.Model<ICountry>) ||
  mongoose.model<ICountry>("Countries", CountrySchema);
