import { Request, Response } from 'express';
import { responseDto } from '../../utilities';
import Vendors from '../../models/Vendors';
import createVendorsAggregationPipeline from '../../pipelines/vendors.pipeline';

export async function followVendor(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';
  const vendorId = req.params.id;

  try {
    const updateVendor = await Vendors.updateOne(
      { _id: vendorId },
      { $inc: { followersCount: 1 }, $push: { usersFollowed: userId } }
    );

    if (updateVendor.modifiedCount > 0)
      return res.status(200).json(responseDto('vendor followed successfully'));

    res.status(409).json({ message: 'vendor might be already followed' });
  } catch (err: any) {
    res.status(400).json(responseDto(err.message));
  }
}

export async function unfollowVendor(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';
  const vendorId = req.params.id;

  try {
    const updateVendor = await Vendors.updateOne(
      { _id: vendorId, usersFollowed: { $eq: userId } },
      { $inc: { followersCount: -1 }, $pull: { usersFollowed: userId } }
    );

    if (updateVendor.modifiedCount > 0)
      return res.status(200).json(responseDto('vendor unfollowed successfully'));

    res.status(409).json({ message: 'vendor might not be followed' });
  } catch (err: any) {
    res.status(400).json(responseDto(err.message));
  }
}

export async function getFollowingVendors(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';

  try {
    const followedVendors = await Vendors.aggregate(
      createVendorsAggregationPipeline(userId, 1, 10, [
        { $match: { usersFollowed: { $eq: userId } } },
      ])
    );
    res.status(200).json(followedVendors);
  } catch (err: any) {
    res.status(400).json(responseDto(err.message));
  }
}
