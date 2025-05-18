import { Request, Response } from 'express';
import { save, unsave } from '../../repositories/save.repository';
import { savedProducts } from '../../repositories/user.repository';
import { AppError } from '../../utils/appErrors';

export async function saveProduct(req: Request, res: Response) {
  const userId = res.locals.userId;
  const productId = req.params.id;
  if (!productId) throw new AppError('required productId', 400);

  const updated = await save(userId, productId);
  if (!updated.matchedCount)
    throw new AppError('could not save product it might be already saved', 409);

  res.status(200).json('Product saved');
}

export async function unsaveProduct(req: Request, res: Response) {
  const userId = res.locals.userId;
  const productId = req.params.id;
  if (!productId) throw new AppError('required productId', 400);

  const updated = await unsave(userId, productId);
  if (!updated.matchedCount)
    throw new AppError('could not unsave product it might not be saved', 409);

  res.status(200).json('Product Unsaved');
}

export async function getSavedProducts(req: Request, res: Response) {
  const userId = res.locals.userId;
  const products = await savedProducts(userId);
  res.status(200).json(products);
}
