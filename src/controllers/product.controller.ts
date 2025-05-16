import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Products from '../models/Products';
import Reviews from '../models/Reviews';
import { responseDto } from '../utils/misc';
import createProductPipeline from '../pipelines/product.aggregation';

export async function getProductAttributes(req: Request, res: Response) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(responseDto('Invalid product ID'));
  }

  try {
    const product = await Products.findById(id)
      .select('productAttributes name hasAttributes seName')
      .lean()
      .exec();

    if (!product) {
      return res.status(404).json(responseDto('Product not found'));
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product attributes:', error);
    return res.status(500).json(responseDto('Failed to fetch product attributes'));
  }
}

export async function getProductDetails(req: Request, res: Response) {
  const { seName } = req.params;
  const userId = res.locals.userId;

  if (!seName) {
    return res.status(400).json(responseDto('SEO name is required'));
  }

  try {
    const pipeline = createProductPipeline(userId, { $match: { seName } });
    const product = (await Products.aggregate(pipeline).exec())[0];

    if (!product) {
      return res.status(404).json(responseDto('Product not found'));
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product details:', error);
    return res.status(500).json(responseDto('Failed to fetch product details'));
  }
}

/**
 * Get product reviews by product ID
 */
export async function getReviews(req: Request, res: Response) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(responseDto('Invalid product ID'));
  }

  try {
    const reviews = await Reviews.find({
      product: new mongoose.Types.ObjectId(id),
    })
      .populate({
        path: 'customer',
        select: 'firstName lastName imageUrl',
      })
      .lean()
      .exec();

    return res.status(200).json(reviews ?? []);
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return res.status(500).json(responseDto('Failed to fetch product reviews'));
  }
}

export async function getUserActions(req: Request, res: Response) {
  const { seName } = req.params;
  const userId = res.locals.userId;

  try {
    const product = await Products.findOne({ seName })
      .select('usersLiked usersSaved usersReviewed usersCarted')
      .exec();

    if (!product) {
      return res.status(404).json(responseDto('Product not found'));
    }

    const isLiked = product.usersLiked.includes(userId);
    const isSaved = product.usersSaved.includes(userId);
    const isReviewed = product.usersReviewed.includes(userId);
    const isInCart = product.usersCarted.includes(userId);

    return res.status(200).json({ isLiked, isReviewed, isInCart, isSaved });
  } catch (error) {
    console.error('Error fetching user actions:', error);
    return res.status(500).json(responseDto('Failed to fetch user actions'));
  }
}
