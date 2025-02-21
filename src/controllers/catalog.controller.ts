import { Request, Response } from 'express';
import { responseDto } from '../utilities';
import db from '../data/mongo-catalog.data';

export async function getProducts(_req: Request, res: Response) {
  try {
    const products = await db.findProducts();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(responseDto('Failed to fetch products'));
  }
}

export async function getSingleProduct(req: Request, res: Response) {
  try {
    const product = await db.findProductById(req.params.id);
    if (!product) {
      return res.status(404).json(responseDto('Product not found'));
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(responseDto('Failed to fetch product'));
  }
}

export async function homeFeed(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page?.toString() ?? '1');
    const limit = parseInt(req.query.limit?.toString() ?? '2');

    const result = await db.getHomeFeedProducts(page, limit);
    return res.status(200).json(responseDto(result.data, true, result.pagination));
  } catch (err) {
    res.status(500).json(responseDto('Failed to fetch home feed'));
  }
}

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
  try {
    const page = parseInt(req.query.page?.toString() ?? '1');
    const limit = 5;

    const result = await db.findProductsByVendor(req.params.id, page, limit);
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

export async function getTags(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page?.toString() ?? '1');
    const limit = 5;

    const result = await db.findTags(page, limit);
    res.status(200).json(responseDto(result.data, true, result.pagination));
  } catch (err) {
    res.status(500).json(responseDto('Failed to fetch tags'));
  }
}

export async function getTagInfo(req: Request, res: Response) {
  try {
    const tag = await db.findTagBySeName(req.params.seName);
    if (!tag) {
      return res.status(404).json(responseDto('Tag not found'));
    }
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(responseDto('Failed to fetch tag'));
  }
}

export async function getTagProducts(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page?.toString() ?? '1');
    const limit = 5;

    const result = await db.findProductsByTag(req.params.id, page, limit);
    res.status(200).json(responseDto(result.data, true, result.pagination));
  } catch (err) {
    res.status(500).json(responseDto('Failed to fetch tag products'));
  }
}

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
    const page = parseInt(req.query.page?.toString() ?? '1');
    const limit = 5;

    const result = await db.findProductsByCategory(req.params.id, page, limit);
    res.status(200).json(responseDto(result.data, true, result.pagination));
  } catch (err) {
    res.status(500).json(responseDto('Failed to fetch category products'));
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

export async function getAllCategoriesSeName(_req: Request, res: Response) {
  try {
    const categories = await db.findAllCategorySeNames();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(responseDto('Failed to fetch category names'));
  }
}

export async function getAllTagsSeName(_req: Request, res: Response) {
  try {
    const tags = await db.findAllTagSeNames();
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(responseDto('Failed to fetch tag IDs'));
  }
}
