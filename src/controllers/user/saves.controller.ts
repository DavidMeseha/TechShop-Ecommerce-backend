import { Request, Response } from 'express';
import { responseDto } from '../../utilities';
import createProductPipeline from '../../pipelines/singleProduct.pipeline';
import Products from '../../models/Products';

export async function saveProduct(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';
  const productId = req.params.id;

  try {
    const productUpdate = await Products.updateOne(
      { _id: productId, usersSaved: { $ne: userId } },
      { $inc: { saves: 1 }, $addToSet: { usersSaved: userId } }
    );

    if (!productUpdate.matchedCount)
      return res.status(409).json(responseDto('could not save product it might be saved already'));

    res.status(200).json(responseDto('Product saved'));
  } catch (err: any) {
    res.status(400).json(responseDto(err.message, false));
  }
}

export async function unsaveProduct(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';
  const productId = req.params.id;

  try {
    const productUpdate = await Products.updateOne(
      { _id: productId, usersSaved: { $eq: userId } },
      { $inc: { saves: -1 }, $pull: { usersSaved: userId } }
    );

    if (!productUpdate.matchedCount)
      return res.status(409).json(responseDto('could not unsave product it might not be saved'));

    res.status(200).json(responseDto('Product Unsaved'));
  } catch (err: any) {
    res.status(400).json(responseDto(err.message, false));
  }
}

export async function getSavedProducts(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';
  try {
    const pipline = createProductPipeline(userId, {
      $match: {
        usersSaved: userId,
      },
    });
    const products = await Products.aggregate(pipline).exec();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(responseDto('error getting user saved products', false));
  }
}
