import { Request, Response } from 'express';
import { generateVariants, responseDto } from '../../utils/misc';
import {
  findCategoriesByName,
  findProductsByName,
  findTagsByName,
  findVendorsByName,
} from '../../repositories/common.repository';

export async function findInAll(req: Request, res: Response) {
  const options = req.body as {
    searchText: string;
    categories: boolean;
    vendors: boolean;
    tags: boolean;
    products: boolean;
  };

  if (!options.searchText) {
    return res.status(400).json(responseDto('Search text is required'));
  }

  try {
    const query = options.searchText;
    const toleranceCount = Math.ceil(query.length * 0.4);
    const queryRegex = `${
      query.length >= 4 ? generateVariants(query, toleranceCount) : query
    }|${query}..`;
    const regex = new RegExp(queryRegex, 'i');

    const enabledOptions = Object.entries(options).filter(
      ([key, value]) => key !== 'searchText' && value
    ).length;

    const limit = Math.floor(8 / enabledOptions);
    const searchPromises = [];
    const items: { item: any; type: string }[] = [];

    if (options.products) searchPromises.push(findProductsByName(regex, limit));
    if (options.vendors) searchPromises.push(findVendorsByName(regex, limit));
    if (options.categories) searchPromises.push(findCategoriesByName(regex, limit));
    if (options.tags) searchPromises.push(findTagsByName(regex, limit));

    const results = await Promise.all(searchPromises);
    results.forEach((result) => items.push(...result));

    return res.status(200).json(items);
  } catch (error) {
    console.error('Error searching:', error);
    return res.status(500).json(responseDto('Search failed'));
  }
}
