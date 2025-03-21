import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Users from '../../models/Users';
import { IAddress } from '../../models/supDocumentsSchema';

export async function deleteAdress(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';
  const addressId = req.params.id;

  try {
    await Users.findByIdAndUpdate(userId, {
      $pull: { addresses: { _id: addressId } },
    });
    res.status(200).json({ message: 'deleted' });
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function newAdress(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';
  const address: IAddress = req.body;

  try {
    if (!address.address || !address.city || !address.country)
      throw new Error('should recive address, country and city');

    const updated = await Users.findByIdAndUpdate(userId, {
      $push: { addresses: { ...address } },
    });
    res.status(200).json(updated);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function editAdress(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';
  const address: IAddress = req.body;
  const addressId = req.params.id;

  try {
    const updated = await Users.updateOne(
      {
        _id: userId,
        addresses: {
          $elemMatch: { _id: new mongoose.Types.ObjectId(addressId) },
        },
      },
      {
        $set: {
          'addresses.$.city': address.city,
          'addresses.$.country': address.country,
          'addresses.$.address': address.address,
        },
      }
    );
    res.status(200).json(updated);
  } catch (err: any) {
    res.status(200).json(err.message);
  }
}

export async function getAdresses(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';

  try {
    const foundUser = await Users.findById(userId)
      .select('addresses')
      .populate('addresses.city addresses.country')
      .exec();

    res.status(200).json(foundUser?.addresses);
  } catch (err: any) {
    res.status(200).json(err.message);
  }
}
