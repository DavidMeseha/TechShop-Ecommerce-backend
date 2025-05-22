import { Types } from 'mongoose';
import { IAddress } from '../models/supDocumentsSchema';
import Users from '../models/Users';

export async function deleteAdress(addressId: string, userId: string) {
  return Users.findByIdAndUpdate(userId, {
    $pull: { addresses: { _id: addressId } },
  });
}

export async function addAddress(userId: string, address: IAddress) {
  return Users.findByIdAndUpdate(userId, {
    $push: { addresses: { ...address } },
  });
}

export async function updateAddress(userId: string, addressId: string, address: IAddress) {
  return Users.updateOne(
    {
      _id: userId,
      addresses: {
        $elemMatch: { _id: new Types.ObjectId(addressId) },
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
}

export async function addresses(userId: string) {
  const user = await Users.findById(userId)
    .select('addresses')
    .populate([
      {
        path: 'addresses.city',
        select: '-__v',
      },
      {
        path: 'addresses.country',
        select: '-cities -__v',
      },
    ])
    .exec();

  if (!user) return [];
  return user.addresses;
}
