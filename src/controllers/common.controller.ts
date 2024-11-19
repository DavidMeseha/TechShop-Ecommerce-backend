import { Request, Response } from "express";
import { IUserTokenPayload, IProductAttribute } from "../global-types";
import Products from "../models/Products";
import { responseDto, validateAttributes } from "../utilities";
import mongoose from "mongoose";
import Users from "../models/Users";
import Countries from "../models/Countries";
import Vendors from "../models/Vendors";
import Categories from "../models/Categories";
import Tags from "../models/Tags";
import Reviews from "../models/Reviews";

export async function getCheckoutDetails(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;

  try {
    const foundUser = await Users.findById(user._id)
      .select("cart addresses")
      .populate("cart.product")
      .lean()
      .exec();

    if (!foundUser || !foundUser.cart) throw new Error("No User found");

    let total = 0;
    for (const item of foundUser.cart)
      total += item.product.price.price * item.quantity;

    res.status(200).json({
      addresses: foundUser.addresses,
      cartItems: foundUser.cart,
      total,
      // clientSecret: paymentIntent.client_secret,
    });
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getReviewIds(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;

  try {
    const reviews = await Reviews.find({
      customer: new mongoose.Types.ObjectId(user._id),
    })
      .select("product")
      .lean()
      .exec();

    res.status(200).json(reviews.map((review) => review.product));
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getLikesId(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  try {
    const found = await Users.findById(user._id).select("likes").lean().exec();
    res.status(200).json(found?.likes ?? []);
  } catch (err) {
    res.status(500).json(responseDto("error getting user lieks", false));
  }
}

export async function getSavesId(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  try {
    const found = await Users.findById(user._id).select("saves").lean().exec();
    res.status(200).json(found?.saves ?? []);
  } catch (err) {
    res
      .status(500)
      .json(responseDto("error getting user saved products", false));
  }
}

export async function getFollowingIds(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  if (!user) return;

  try {
    const foundUser = await Users.findById(user._id)
      .select("following")
      .lean()
      .exec();
    if (!foundUser) throw new Error("No user Found");
    res.status(200).json(foundUser.following);
  } catch (err: any) {
    res.status(400).json(responseDto(err.message));
  }
}

export async function addProductToCart(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  const productId: string = req.params.id;
  const quantity: number | undefined = req.body.quantity;
  const attributes: (IProductAttribute & mongoose.Document)[] | undefined =
    req.body.attributes;

  if (!productId) res.status(400).json("missing product id");

  try {
    const product = await Products.findByIdAndUpdate(productId, {
      $inc: { carts: 1 },
    })
      .select("productAttributes")
      .lean()
      .exec();

    if (!product) throw new Error("wrong product Id");

    validateAttributes(attributes ?? [], product.productAttributes);

    const updated = await Users.updateOne(
      {
        _id: user._id,
        cart: {
          $not: {
            $elemMatch: { product: new mongoose.Types.ObjectId(productId) },
          },
        },
      },
      {
        $push: {
          cart: {
            product: new mongoose.Types.ObjectId(productId),
            quantity,
            attributes,
          },
        },
      }
    );

    if (!updated.matchedCount) throw new Error("Could not add product to cart");
    res.status(200).json("Product added to cart");
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getCartProductsIds(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;

  try {
    const userCart = await Users.findById(user._id)
      .select("cart.product cart.quantity")
      .lean()
      .exec();

    res.status(200).json(userCart?.cart);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getCartProducts(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;

  try {
    const userCart = await Users.findById(user._id)
      .select("cart")
      .populate("cart.product")
      .lean()
      .exec();

    res.status(200).json(userCart?.cart);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function removeProductFromCart(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  const productId: string = req.params.id;

  try {
    const updated = await Users.updateOne(
      {
        _id: user._id,
        cart: {
          $elemMatch: { product: new mongoose.Types.ObjectId(productId) },
        },
      },
      {
        $pull: { cart: { product: new mongoose.Types.ObjectId(productId) } },
      }
    );

    if (!updated.modifiedCount)
      throw new Error("The product is not in user's cart");

    await Products.updateOne(
      { _id: productId },
      { $inc: { carts: -1 } }
    ).exec();

    res.status(200).json("Item Removed from cart");
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function changeLanguage(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  const language: string = req.params.lang;

  try {
    if (language !== "en" && language !== "ar")
      throw new Error("language is not supported");

    await Users.updateOne(
      { _id: new mongoose.Types.ObjectId(user._id) },
      { language: language }
    );

    res.status(200).json("language changed");
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getCountries(req: Request, res: Response) {
  try {
    const countries = await Countries.find({}).lean().exec();
    res.status(200).json(countries);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getCities(req: Request, res: Response) {
  const countryId: string = req.params.id;

  try {
    const country = await Countries.findById(countryId)
      .select("cities")
      .populate("cities")
      .lean()
      .exec();

    setTimeout(() => {
      res.status(200).json(country?.cities);
    }, 2000);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getAllUserActions(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;

  try {
    const foundUser = await Users.findById(user._id).lean().exec();
    const reviews = await Reviews.find({ customer: foundUser?._id })
      .select("_id")
      .lean()
      .exec();
    res.status(200).json({
      reviews: reviews ?? [],
      cart: foundUser?.cart ?? [],
      likes: foundUser?.likes ?? [],
      saves: foundUser?.saves ?? [],
      follows: foundUser?.following ?? [],
    });
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function findInAll(req: Request, res: Response) {
  const options: {
    searchText: string;
    categories: boolean;
    vendors: boolean;
    tags: boolean;
    products: boolean;
  } = req.body;

  const items: {
    item: any;
    type: string;
  }[] = [];

  const regex = new RegExp(options.searchText, "i");

  try {
    let optionsCount = -1;
    let key: keyof typeof options;
    for (key in options) if (options[key]) optionsCount++;

    if (options.products) {
      const products = await Products.find({
        $or: [{ name: regex }],
      })
        .limit(Math.floor(8 / optionsCount))
        .lean();

      const productItems = products.map((product) => ({
        item: product,
        type: "product",
      }));
      items.push(...productItems);
    }

    if (options.vendors) {
      const vendors = await Vendors.find({
        $or: [{ name: regex }],
      })
        .limit(Math.floor(8 / optionsCount))
        .lean();

      const vendorItems = vendors.map((vendor) => ({
        item: vendor,
        type: "vendor",
      }));
      items.push(...vendorItems);
    }

    if (options.categories) {
      const categories = await Categories.find({
        $or: [{ name: regex }],
      })
        .limit(Math.floor(8 / optionsCount))
        .lean();

      const categryItems = categories.map((category) => ({
        item: category,
        type: "category",
      }));
      items.push(...categryItems);
    }

    if (options.tags) {
      const tags = await Tags.find({
        $or: [{ name: regex }],
      })
        .limit(Math.floor(8 / optionsCount))
        .lean();

      const tagItems = tags.map((tag) => ({
        item: tag,
        type: "tag",
      }));
      items.push(...tagItems);
    }

    res.status(200).json(items);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}
