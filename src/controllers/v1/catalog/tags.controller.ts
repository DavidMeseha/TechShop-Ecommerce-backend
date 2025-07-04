import { Request, Response } from 'express';
import { responseDto } from '@/utils/misc';
import {
  findAllTagSeNames,
  findProductsByTag,
  findTagBySeName,
  findTags,
} from '@/repositories/catalog.repository';
import { AppError } from '@/utils/appErrors';

export async function getTags(req: Request, res: Response) {
  const page = parseInt(req.query.page?.toString() ?? '1');
  const limit = parseInt(req.query.limit?.toString() ?? '5');

  const result = await findTags(page, limit);
  res.status(200).json(responseDto(result.data, true, result.pagination));
}

export async function getTagInfo(req: Request, res: Response) {
  const seName = req.params.seName;
  if (!seName) throw new AppError('tag seName is required', 400);

  const tag = await findTagBySeName(seName);
  if (!tag) throw new AppError('Tag not found', 404);

  res.status(200).json(tag);
}

export async function getTagProducts(req: Request, res: Response) {
  const userId = res.locals.userId;
  const page = parseInt(req.query.page?.toString() ?? '1');
  const limit = parseInt(req.query.limit?.toString() ?? '5');
  const seName = req.params.seName;
  if (!seName) throw new AppError('missing tag SeName', 400);

  const result = await findProductsByTag(userId, seName, page, limit);
  res.status(200).json(responseDto(result.data, true, result.pagination));
}

export async function getAllTagsSeName(_req: Request, res: Response) {
  const tags = await findAllTagSeNames();
  res.status(200).json(tags);
}
