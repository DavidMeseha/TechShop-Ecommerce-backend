import { Request, Response } from 'express';
import { responseDto } from '../../utils/misc';
import {
  findAllCategorySeNames,
  findCategories,
  findCategoryBySeName,
  findProductsByCategory,
} from '../../repositories/catalog.repository';
import { AppError } from '../../utils/appErrors';

export async function getCategories(req: Request, res: Response) {
  const page = parseInt(req.query.page?.toString() ?? '1');
  const limit = parseInt(req.query.limit?.toString() ?? '5');

  const result = await findCategories(page, limit);
  res.status(200).json(responseDto(result.data, true, result.pagination));
}

export async function getCategoryInfo(req: Request, res: Response) {
  const seName = req.params.seName;
  if (!seName) throw new AppError('seName is required', 400);

  const category = await findCategoryBySeName(seName);
  if (!category) throw new AppError('Category not found', 404);

  res.status(200).json(category);
}

export async function getCategoryProducts(req: Request, res: Response) {
  const userId = res.locals.userId;
  const page = parseInt(req.query.page?.toString() ?? '1');
  const limit = parseInt(req.query.limit?.toString() ?? '5');
  const categoryId = req.params.id;

  const result = await findProductsByCategory(userId, categoryId, page, limit);
  res.status(200).json(responseDto(result.data, true, result.pagination));
}

export async function getAllCategoriesSeName(_req: Request, res: Response) {
  const categories = await findAllCategorySeNames();
  res.status(200).json(categories);
}
