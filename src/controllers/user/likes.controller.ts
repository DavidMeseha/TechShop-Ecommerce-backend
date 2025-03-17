import { Request, Response } from 'express';
import Products from '../../models/Products';
import { responseDto } from '../../utilities';
import createProductPipeline from '../../pipelines/singleProduct.pipeline';

export async function likeProduct(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';
  const { id: productId } = req.params;

  try {
    const productUpdate = await Products.updateOne(
      { _id: productId, usersLiked: { $ne: userId } },
      { $inc: { likes: 1 }, $push: { usersLiked: userId } }
    );

    if (!productUpdate.matchedCount) {
      return res.status(409).json(responseDto('Could not like Product it might be already liked'));
    }

    return res.status(200).json(responseDto('Product liked successfully', true));
  } catch (error) {
    console.error('Error liking product:', error);
    return res.status(500).json(responseDto('Failed to like product'));
  }
}

export async function unlikeProduct(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';
  const { id: productId } = req.params;

  try {
    const productUpdate = await Products.updateOne(
      { _id: productId, usersLiked: { $eq: userId } },
      { $inc: { likes: -1 }, $pull: { usersLiked: userId } }
    );

    if (!productUpdate.matchedCount) {
      return res.status(409).json(responseDto('Could not unlike Product it might be not liked'));
    }

    return res.status(200).json(responseDto('Product unliked successfully', true));
  } catch (error) {
    console.error('Error unliking product:', error);
    return res.status(500).json(responseDto('Failed to unlike product'));
  }
}

export async function getLikedProducts(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';
  try {
    const pipline = createProductPipeline(userId, {
      $match: {
        usersLiked: userId,
      },
    });
    const products = await Products.aggregate(pipline).exec();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(responseDto('error getting user lieks', false));
  }
}
