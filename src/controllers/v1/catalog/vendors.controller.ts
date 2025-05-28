import { Request, Response } from 'express';
import { isValidIdFormat, responseDto } from '@/utils/misc';
import { AppError } from '@/utils/appErrors';
import {
  findAllVendorSeNames,
  findProductsByVendor,
  findVendorBySeName,
  findVendors,
} from '@/repositories/catalog.repository';

export async function getVendorInfo(req: Request, res: Response) {
  const userId = res.locals.userId;
  const seName = req.params.seName;
  if (!seName) throw new AppError('seName is required', 400);

  const vendor = await findVendorBySeName(userId, seName);
  if (!vendor) throw new AppError('Vendor not found', 404);

  res.status(200).json(vendor);
}

export async function getVendorProducts(req: Request, res: Response) {
  const userId = res.locals.userId;
  const page = parseInt(req.query.page?.toString() ?? '1');
  const limit = parseInt(req.query.limit?.toString() ?? '5');
  const vendorId = req.params.id;
  if (!isValidIdFormat(vendorId)) throw new AppError('vendorId is no a valid id', 400);

  const result = await findProductsByVendor(userId, vendorId, page, limit);
  res.status(200).json(responseDto(result.data, true, result.pagination));
}

export async function getVendors(req: Request, res: Response) {
  const userId = res.locals.userId;
  const page = parseInt(req.query.page?.toString() ?? '1');
  const limit = parseInt(req.query.limit?.toString() ?? '5');

  const result = await findVendors(userId, page, limit);
  res.status(200).json(responseDto(result.data, true, result.pagination));
}

export async function getAllVendorsSeName(_req: Request, res: Response) {
  const vendors = await findAllVendorSeNames();
  res.status(200).json(vendors);
}
