import { Request, Response } from 'express';
import { AppError } from '@/utils/appErrors';
import { IAddress } from '@/types/user.interface';
import {
  addAddress,
  addresses,
  deleteAdress,
  updateAddress,
} from '@/repositories/address.repository';

type AddressBody = Omit<IAddress<string, string>, '_id'>;

export async function removeAddress(req: Request, res: Response) {
  const userId = res.locals.userId;
  const addressId = req.params.id;

  await deleteAdress(addressId, userId);
  res.status(200).json({ success: true, message: 'address deleted' });
}

export async function newAdress(req: Request, res: Response) {
  const userId = res.locals.userId;
  const address: Partial<AddressBody> = req.body;

  if (!(address.address && address.city && address.country))
    throw new AppError('should recive address, country and city', 400);

  const addressToAdd: AddressBody = {
    address: address.address,
    city: address.city,
    country: address.country,
  };

  const update = await addAddress(userId, addressToAdd);
  if (update.modifiedCount === 0) throw new AppError('error adding address', 500);

  res.status(201).json({ success: true, message: 'address added' });
}

export async function editAdress(req: Request, res: Response) {
  const userId = res.locals.userId;
  const address: Partial<AddressBody> = req.body;
  const addressId = req.params.id;

  if (!address.address || !address.city || !address.country)
    throw new AppError('should recive address, country and city', 400);

  const updatedAddress: AddressBody = {
    address: address.address,
    city: address.city,
    country: address.country,
  };

  await updateAddress(userId, addressId, updatedAddress);
  res.status(200).json({ success: true, message: 'address updated successfuly' });
}

export async function getAdresses(req: Request, res: Response) {
  const userId = res.locals.userId;
  const userAddresses = await addresses(userId);
  res.status(200).json(userAddresses);
}
