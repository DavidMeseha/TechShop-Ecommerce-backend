import { Request, Response } from 'express';
import { responseDto } from '../../utilities';
import db from '../../data/catalog.data';

export async function getVendorInfo(req: Request, res: Response) {
  try {
    const vendor = await db.findVendorBySeName(req.params.seName);
    if (!vendor) {
      return res.status(404).json(responseDto('Vendor not found'));
    }
    res.status(200).json(vendor);
  } catch (err) {
    res.status(500).json(responseDto('Failed to fetch vendor'));
  }
}

export async function getVendorProducts(req: Request, res: Response) {
  const userId = res.locals.user._id ?? '';
  const vendorId = req.params.id;
  const page = parseInt(req.query.page?.toString() ?? '1');
  const limit = parseInt(req.query.limit?.toString() ?? '5');

  try {
    const result = await db.findProductsByVendor(userId, vendorId, page, limit);
    res.status(200).json(responseDto(result.data, true, result.pagination));
  } catch (err) {
    res.status(500).json(responseDto('Failed to fetch vendor products'));
  }
}

export async function getVendors(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page?.toString() ?? '1');
    const limit = 5;

    const result = await db.findVendors(page, limit);
    res.status(200).json(responseDto(result.data, true, result.pagination));
  } catch (err) {
    res.status(500).json(responseDto('Failed to fetch vendors'));
  }
}

export async function getAllVendorsSeName(_req: Request, res: Response) {
  try {
    const vendors = await db.findAllVendorSeNames();
    res.status(200).json(vendors);
  } catch (err) {
    res.status(500).json(responseDto('Failed to fetch vendor IDs'));
  }
}
