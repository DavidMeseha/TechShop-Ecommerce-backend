import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Users from '../../models/Users';
import Countries from '../../models/Countries';
import { languages } from '../../locales/useT';
import { AppError } from '../../utils/appErrors';

export async function changeLanguage(req: Request, res: Response) {
  const userId = res.locals.userId;
  const language: string = req.params.lang;

  const isSupported = !!languages.find((lang) => lang === language);
  if (!isSupported) throw new AppError('language is not supported or missing', 400);

  await Users.updateOne({ _id: new Types.ObjectId(userId) }, { language: language });
  res.status(200).json({ status: 'success', message: 'language changed' });
}

export async function getCountries(req: Request, res: Response) {
  const countries = await Countries.find({}).select('-cities').exec();
  res.status(200).json(countries);
}

export async function getCities(req: Request, res: Response) {
  const countryId: string = req.params.id;
  const country = await Countries.findById(countryId).select('cities').populate('cities').exec();
  res.status(200).json(country?.cities);
}
