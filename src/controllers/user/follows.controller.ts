import { Request, Response } from 'express';
import { responseDto } from '../../utils/misc';
import { addFollow, removeFollow, userFollowedVendors } from '../../repositories/follow.repository';
import { AppError } from '../../utils/appErrors';

export async function followVendor(req: Request, res: Response) {
  const userId = res.locals.userId;
  const vendorId = req.params.id;
  if (!vendorId) throw new AppError('vendorId is required', 400);

  const updateVendor = await addFollow(userId, vendorId);

  if (updateVendor.modifiedCount > 0)
    return res.status(200).json(responseDto('vendor followed successfully'));

  throw new AppError('vendor might be already followed', 409);
}

export async function unfollowVendor(req: Request, res: Response) {
  const userId = res.locals.userId;
  const vendorId = req.params.id;
  if (!vendorId) throw new AppError('vendorId is required', 400);

  const updateVendor = await removeFollow(userId, vendorId);
  if (updateVendor.modifiedCount > 0)
    return res.status(200).json(responseDto('vendor unfollowed successfully'));

  throw new AppError('vendor might not be followed', 409);
}

export async function getFollowingVendors(req: Request, res: Response) {
  const userId = res.locals.userId;
  const followedVendors = await userFollowedVendors(userId);
  res.status(200).json(followedVendors);
}
