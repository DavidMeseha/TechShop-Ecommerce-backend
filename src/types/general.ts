import { Types } from 'mongoose';

export type ObjectIdType = Types.ObjectId;

export interface ICity {
  _id: ObjectIdType;
  name: string;
  code: string;
}

export interface ICountry {
  _id: ObjectIdType;
  name: string;
  code: string;
  cities: ICity[];
}
