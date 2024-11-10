import { Request, Response } from "express";
import Products from "../models/Products";
import { ITag, IUserTokenPayload } from "../global-types";
import Reviews from "../models/Reviews";
import { responseDto } from "../utilities";
import Vendors from "../models/Vendors";
import Tags from "../models/Tags";
import Categories from "../models/Categories";
import * as countries from "../Countries-cities-data/data";
import Cities from "../models/Cities";
import Counties from "../models/Countries";

export async function getProducts(_req: Request, res: Response) {
  const products = await Products.find({}).exec();
  res.status(200).json(products);
}

export async function getSingleProduct(req: Request, res: Response) {
  const id = req.params.id;

  const product = await Products.findById(id)
    .populate({ path: "vendor", select: "_id name imageUrl seName" })
    .populate({
      path: "productReviews",
      select: "product customer reviewText rating",
      populate: "customer",
    })
    .lean()
    .exec();

  res.status(200).json(product);
}

export async function homeFeed(req: Request, res: Response) {
  // const user: IUserTokenPayload = res.locals.user;

  // const userInfo = await Users.findById(user._id)
  //   .populate("recentProducts")
  //   .lean()
  //   .exec();

  const page = parseInt(req.query.page?.toString() ?? "1");
  const limit = 2;

  let products = await Products.find({})
    .populate("vendor productTags")
    .limit(limit + 1)
    .skip((page - 1) * limit)
    .exec();

  const hasNext = products.length > limit && !!products.pop();

  return res
    .status(200)
    .json(responseDto(products, true, { hasNext, limit, current: page }));
}

export async function getVendorInfo(req: Request, res: Response) {
  const vendorId = req.params.id;

  try {
    const vendor = await Vendors.findById(vendorId).lean().exec();
    res.status(200).json(vendor);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getVendorProducts(req: Request, res: Response) {
  const vendorId = req.params.id;
  const page = parseInt(req.query.page?.toString() ?? "1");
  const limit = 5;

  try {
    const products = await Products.find({ vendor: vendorId })
      .limit(limit + 1)
      .skip((page - 1) * limit)
      .lean()
      .exec();

    const hasNext = products.length > limit && !!products.pop();

    res
      .status(200)
      .json(responseDto(products, true, { hasNext, limit, current: page }));
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getVendors(req: Request, res: Response) {
  const page = parseInt(req.query.page?.toString() ?? "1");
  const limit = 5;

  try {
    const vendors = await Vendors.find({})
      .limit(limit + 1)
      .skip((page - 1) * limit)
      .lean()
      .exec();

    const hasNext = vendors.length > limit && !!vendors.pop();

    res
      .status(200)
      .json(responseDto(vendors, true, { hasNext, limit, current: page }));
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getTags(req: Request, res: Response) {
  const page = parseInt(req.query.page?.toString() ?? "1");
  const limit = 5;

  try {
    const tags = await Tags.find({})
      .limit(limit + 1)
      .skip((page - 1) * limit)
      .lean()
      .exec();

    const hasNext = tags.length > limit && !!tags.pop();

    res
      .status(200)
      .json(responseDto(tags, true, { hasNext, limit, current: page }));
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getTagInfo(req: Request, res: Response) {
  const tagId = req.params.id;

  try {
    const tag = await Tags.findById(tagId).lean().exec();
    res.status(200).json(tag);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getTagProducts(req: Request, res: Response) {
  const tagId = req.params.id;
  const page = parseInt(req.query.page?.toString() ?? "1");
  const limit = 5;

  try {
    const products = await Products.find({ productTags: tagId })
      .limit(limit + 1)
      .skip((page - 1) * limit)
      .lean()
      .exec();

    const hasNext = products.length > limit && !!products.pop();

    res
      .status(200)
      .json(responseDto(products, true, { hasNext, limit, current: page }));
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getCategories(req: Request, res: Response) {
  const page = parseInt(req.query.page?.toString() ?? "1");
  const limit = 5;

  try {
    const categories = await Categories.find({})
      .limit(limit + 1)
      .skip((page - 1) * limit)
      .lean()
      .exec();

    const hasNext = categories.length > limit && !!categories.pop();

    res
      .status(200)
      .json(responseDto(categories, true, { hasNext, limit, current: page }));
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getCategoryInfo(req: Request, res: Response) {
  const categoryId = req.params.id;

  try {
    const category = await Categories.findById(categoryId).lean().exec();
    res.status(200).json(category);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getCategoryProducts(req: Request, res: Response) {
  const categoryId = req.params.id;
  const page = parseInt(req.query.page?.toString() ?? "1");
  const limit = 5;

  try {
    const products = await Products.find({ category: categoryId })
      .limit(limit + 1)
      .skip((page - 1) * limit)
      .lean()
      .exec();

    const hasNext = products.length > limit && !!products.pop();

    res
      .status(200)
      .json(responseDto(products, true, { hasNext, limit, current: page }));
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function test(req: Request, res: Response) {
  let key: keyof typeof countries;
  let x;
  try {
    // for (key in countries) {
    //   const cities = countries[key][2] as string[][];
    //   const citiesMap = cities.map((city) => ({
    //     name: city[0],
    //     code: city[1],
    //   }));
    //   x = await Cities.insertMany([...citiesMap]);

    //   const ids = x.map((anX) => anX._id);

    //   const c = Counties.create({
    //     name: countries[key][0],
    //     code: countries[key][1],
    //     cities: ids,
    //   });
    // }
    res.status(200).json(x);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}
