import { Request, Response } from 'express';
import { responseDto } from '../../utilities';
import db from '../../data/catalog.data';

export async function getCategories(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page?.toString() ?? '1');
    const limit = 5;

    const result = await db.findCategories(page, limit);
    res.status(200).json(responseDto(result.data, true, result.pagination));
  } catch (err) {
    res.status(500).json(responseDto('Failed to fetch categories'));
  }
}

export async function getCategoryInfo(req: Request, res: Response) {
  try {
    const category = await db.findCategoryBySeName(req.params.seName);
    if (!category) {
      return res.status(404).json(responseDto('Category not found'));
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(responseDto('Failed to fetch category'));
  }
}

export async function getCategoryProducts(req: Request, res: Response) {
  try {
    const categoryId = req.params.id;
    const userId = res.locals.user._id;
    const page = parseInt(req.query.page?.toString() ?? '1');
    const limit = parseInt(req.query.limit?.toString() ?? '5');

    const result = await db.findProductsByCategory(userId, categoryId, page, limit);
    res.status(200).json(responseDto(result.data, true, result.pagination));
  } catch (err) {
    res.status(500).json(responseDto('Failed to fetch category products'));
  }
}

export async function getAllCategoriesSeName(_req: Request, res: Response) {
  try {
    const categories = await db.findAllCategorySeNames();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(responseDto('Failed to fetch category names'));
  }
}
