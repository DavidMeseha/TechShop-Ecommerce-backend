import { Types } from 'mongoose';
import Users from '@/models/Users';
import { IAddress, IUser } from '@/types/user.interface';

type AddressProps = Omit<IAddress<string, string>, '_id'>;

export async function deleteAdress(addressId: string, userId: string) {
  return Users.findByIdAndUpdate(userId, {
    $pull: { addresses: { _id: addressId } },
  });
}

export async function addAddress(userId: string, address: AddressProps) {
  return Users.updateOne(
    { _id: userId },
    {
      $push: { addresses: { ...address } },
    }
  );
}

export async function updateAddress(userId: string, addressId: string, address: AddressProps) {
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
  const addresses = await Users.aggregate<Pick<IUser, '_id' | 'addresses'>>([
    {
      $match: {
        _id: new Types.ObjectId(userId),
      },
    },
    {
      $unwind: {
        path: '$addresses',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'cities',
        localField: 'addresses.city',
        foreignField: '_id',
        as: 'addresses.city',
      },
    },
    {
      $lookup: {
        from: 'countries',
        localField: 'addresses.country',
        foreignField: '_id',
        as: 'addresses.country',
      },
    },
    {
      $unwind: {
        path: '$addresses.city',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: '$addresses.country',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        'addresses.city.__v': 0,
        'addresses.country.__v': 0,
        'addresses.country.cities': 0,
      },
    },
    {
      $group: {
        _id: '$_id',
        addresses: { $push: '$addresses' },
      },
    },
  ]).exec();

  if (!addresses.length) return [];
  return addresses[0].addresses;
}
