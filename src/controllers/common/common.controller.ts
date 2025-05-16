import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Users from '../../models/Users';
import Countries from '../../models/Countries';
import { languages } from '../../locales/useT';

export async function changeLanguage(req: Request, res: Response) {
  const userId = res.locals.userId;
  const language: string = req.params.lang;

  try {
    const isSupported = !!languages.find((lang) => lang === language);
    if (!isSupported) throw new Error('language is not supported');

    await Users.updateOne({ _id: new Types.ObjectId(userId) }, { language: language });

    res.status(200).json('language changed');
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getCountries(req: Request, res: Response) {
  try {
    const countries = await Countries.find({}).select('-cities').exec();
    res.status(200).json(countries);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getCities(req: Request, res: Response) {
  const countryId: string = req.params.id;

  try {
    const country = await Countries.findById(countryId).select('cities').populate('cities').exec();

    setTimeout(() => {
      res.status(200).json(country?.cities);
    }, 2000);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}
