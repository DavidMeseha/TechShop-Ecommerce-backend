import { Request, Response } from "express";
import { IUserTokenPayload, IProductAttribute } from "../global-types";
import Products from "../models/Products";
import { validateAttributes } from "../utilities";
import mongoose from "mongoose";
import Users from "../models/Users";
import Countries from "../models/Countries";

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
