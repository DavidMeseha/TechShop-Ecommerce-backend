import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { IUserTokenPayload } from '../interfaces/user.interface';
import { generateVariants, responseDto } from '../utilities';
import Products from '../models/Products';
import Users from '../models/Users';
import Countries from '../models/Countries';
import Reviews from '../models/Reviews';
import { languages } from '../locales/useT';
import db from '../data/mongo-common.data';

// Cart Related Controllers
/**
 * Get checkout details for the current user
 */
export async function getCheckoutDetails(_req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;

  try {
    const foundUser = await db.getUserCart(user._id);
    if (!foundUser) return res.status(404).json(responseDto('User not found'));

    const cart = foundUser.cart ?? [];
    const total = cart.reduce(
      (sum, item) => ('price' in item.product ? sum + item.product.price.price * item.quantity : 0),
      0
    );

    return res.status(200).json({
      addresses: foundUser.addresses,
      cartItems: cart,
      total,
    });
  } catch (error) {
    console.error('Error getting checkout details:', error);
    return res.status(500).json(responseDto('Failed to get checkout details'));
  }
}

/**
 * Add product to user's cart
 */
export async function addProductToCart(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  const { id: productId } = req.params;
  const { quantity, attributes } = req.body;

  if (!productId) {
    return res.status(400).json(responseDto('Product ID is required'));
  }

  try {
    const addToCartStatus = await db.addProductToUserCart(
      user._id,
      productId,
      attributes,
      quantity
    );
    if (addToCartStatus.isError) return res.status(400).json(responseDto(addToCartStatus.message));
    return res.status(200).json(responseDto(addToCartStatus.message, true));
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return res.status(500).json(responseDto('Failed to add product to cart'));
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

    if (!updated.modifiedCount) throw new Error("The product is not in user's cart");

    await Products.updateOne({ _id: productId }, { $inc: { carts: -1 } }).exec();

    res.status(200).json('Item Removed from cart');
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

// User Actions Controllers
/**
 * Get all user actions (reviews, cart, likes, saves, follows)
 */
export async function getAllUserActions(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;

  try {
    const actions = await db.allUserActions(user._id);

    if (!actions) {
      return res.status(404).json(responseDto('User not found'));
    }

    return res.status(200).json(actions);
  } catch (error) {
    console.error('Error getting user actions:', error);
    return res.status(500).json(responseDto('Failed to get user actions'));
  }
}

// Search Controller
/**
 * Search across multiple collections
 */
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

    if (options.products) searchPromises.push(db.findProductsByName(regex, limit));
    if (options.vendors) searchPromises.push(db.findVendorsByName(regex, limit));
    if (options.categories) searchPromises.push(db.findCategoriesByName(regex, limit));
    if (options.tags) searchPromises.push(db.findTagsByName(regex, limit));

    const results = await Promise.all(searchPromises);
    results.forEach((result) => items.push(...result));

    return res.status(200).json(items);
  } catch (error) {
    console.error('Error searching:', error);
    return res.status(500).json(responseDto('Search failed'));
  }
}

export async function getReviewIds(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;

  try {
    const reviews = await Reviews.find({
      customer: new mongoose.Types.ObjectId(user._id),
    })
      .select('product')
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
    const found = await Users.findById(user._id).select('likes').lean().exec();
    res.status(200).json(found?.likes ?? []);
  } catch (err) {
    res.status(500).json(responseDto('error getting user lieks', false));
  }
}

export async function getSavesId(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;

  try {
    const found = await Users.findById(user._id).select('saves').lean().exec();
    res.status(200).json(found?.saves ?? []);
  } catch (err) {
    res.status(500).json(responseDto('error getting user saved products', false));
  }
}

export async function getFollowingIds(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  if (!user) return;

  try {
    const foundUser = await Users.findById(user._id).select('following').lean().exec();
    if (!foundUser) throw new Error('No user Found');
    res.status(200).json(foundUser.following);
  } catch (err: any) {
    res.status(400).json(responseDto(err.message));
  }
}

export async function getCartProductsIds(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;

  try {
    const userCart = await Users.findById(user._id)
      .select('cart.product cart.quantity')
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
      .select('cart')
      .populate('cart.product')
      .lean()
      .exec();

    res.status(200).json(userCart?.cart);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function changeLanguage(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  const language: string = req.params.lang;

  try {
    const isSupported = !!languages.find((lang) => lang === language);
    if (!isSupported) throw new Error('language is not supported');

    await Users.updateOne({ _id: new mongoose.Types.ObjectId(user._id) }, { language: language });

    res.status(200).json('language changed');
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getCountries(req: Request, res: Response) {
  try {
    const countries = await Countries.find({}).select('-cities').lean().exec();
    res.status(200).json(countries);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getCities(req: Request, res: Response) {
  const countryId: string = req.params.id;

  try {
    const country = await Countries.findById(countryId)
      .select('cities')
      .populate('cities')
      .lean()
      .exec();

    setTimeout(() => {
      res.status(200).json(country?.cities);
    }, 2000);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}
