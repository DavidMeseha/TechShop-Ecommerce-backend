import { Request, Response } from 'express';
import { responseDto } from '../../utils/misc';
import db from '../../repositories/catalog.repository';

export async function getTags(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page?.toString() ?? '1');
    const limit = parseInt(req.query.limit?.toString() ?? '5');

    const result = await db.findTags(page, limit);
    res.status(200).json(responseDto(result.data, true, result.pagination));
  } catch (err) {
    res.status(500).json(responseDto(err));
  }
}

export async function getTagInfo(req: Request, res: Response) {
  const seName = req.params.seName;

  try {
    const tag = await db.findTagBySeName(seName);
    if (!tag) {
      return res.status(404).json(responseDto('Tag not found'));
    }
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(responseDto(err));
  }
}

export async function getTagProducts(req: Request, res: Response) {
  const userId = res.locals.userId;
  const tagId = req.params.id;
  const page = parseInt(req.query.page?.toString() ?? '1');
  const limit = parseInt(req.query.limit?.toString() ?? '5');

  try {
    const result = await db.findProductsByTag(userId, tagId, page, limit);
    res.status(200).json(responseDto(result.data, true, result.pagination));
  } catch (err) {
    res.status(500).json(responseDto(err));
  }
}

export async function getAllTagsSeName(_req: Request, res: Response) {
  try {
    const tags = await db.findAllTagSeNames();
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(responseDto(err));
  }
}
