import Vendors from '../models/Vendors';
import createVendorsPipeline from '../pipelines/vendors.aggregation';
import { AppError } from '../utils/appErrors';
import { isValidIdFormat } from '../utils/misc';

export async function addFollow(userId: string, vendorId: string) {
  if (!isValidIdFormat(vendorId)) throw new AppError('vendorId is not a valid id', 400);

  return Vendors.updateOne(
    { _id: vendorId, usersFollowed: { $ne: userId } },
    { $inc: { followersCount: 1 }, $push: { usersFollowed: userId } }
  );
}

export async function removeFollow(userId: string, vendorId: string) {
  if (!isValidIdFormat(vendorId)) throw new AppError('vendorId is not a valid id', 400);

  return Vendors.updateOne(
    { _id: vendorId, usersFollowed: { $eq: userId } },
    { $inc: { followersCount: -1 }, $pull: { usersFollowed: userId } }
  );
}

export async function userFollowedVendors(userId: string) {
  const pipeline = createVendorsPipeline(userId, 1, 10, [
    { $match: { usersFollowed: { $eq: userId } } },
  ]);

  return Vendors.aggregate(pipeline);
}
