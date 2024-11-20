import { Request, Response } from "express";
import { IProductReview, IUserTokenPayload } from "../global-types";
import { responseDto } from "../utilities";
import mongoose from "mongoose";
import Users from "../models/Users";
import Products from "../models/Products";
import Reviews from "../models/Reviews";
import Vendors from "../models/Vendors";
import bcrypt from "bcrypt-nodejs";
import { IAddress } from "../models/supDocumentsSchema";
import Orders from "../models/Orders";
import Stripe from "stripe";

type IUserInfoBody = {
  dateOfBirthDay: number;
  dateOfBirthMonth: number;
  dateOfBirthYear: number;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  imageUrl: string;
  phone: string;
};

const STRIPE_SECRET = process.env.STRIPE_SECRET;

export async function likeProduct(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  const productId = req.params.id;

  try {
    const isUpdated = (
      await Products.updateOne({ _id: productId }, { $inc: { likes: 1 } })
    ).matchedCount;

    if (!isUpdated) throw new Error("wrong Product Id");

    await Users.updateOne(
      {
        _id: user._id,
        likes: { $ne: new mongoose.Types.ObjectId(productId) },
      },
      {
        $push: { likes: new mongoose.Types.ObjectId(productId) },
      }
    );

    res.status(200).json(responseDto("Product Liked"));
  } catch (err) {
    res
      .status(500)
      .json(responseDto("could not complete the Like Action", false));
  }
}

export async function unlikeProduct(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  const productId = req.params.id;

  try {
    const isUpdated = (
      await Users.updateOne(
        {
          _id: user._id,
          likes: new mongoose.Types.ObjectId(productId),
        },
        {
          $pull: { likes: new mongoose.Types.ObjectId(productId) },
        }
      )
    ).matchedCount;

    if (!isUpdated) throw new Error("Product is not liked");

    await Products.updateOne({ _id: productId }, { $inc: { likes: -1 } });

    res.status(200).json(responseDto("Product Unliked"));
  } catch (err: any) {
    res.status(400).json(responseDto(err.message, false));
  }
}

export async function saveProduct(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  const productId = req.params.id;

  try {
    const isUpdated = !!(
      await Users.updateOne(
        {
          _id: user._id,
          saves: { $ne: new mongoose.Types.ObjectId(productId) },
        },
        {
          $push: { saves: new mongoose.Types.ObjectId(productId) },
        }
      )
    ).matchedCount;

    if (!isUpdated) throw new Error("Product already saved");

    await Products.updateOne({ _id: productId }, { $inc: { saves: 1 } });

    res.status(200).json(responseDto("Product saved"));
  } catch (err: any) {
    res.status(400).json(responseDto(err.message, false));
  }
}

export async function unsaveProduct(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  const productId = req.params.id;

  try {
    const isUpdated = !!(
      await Users.updateOne(
        {
          _id: user._id,
          saves: new mongoose.Types.ObjectId(productId),
        },
        {
          $pull: { saves: new mongoose.Types.ObjectId(productId) },
        }
      )
    ).matchedCount;

    if (!isUpdated)
      throw new Error("could not unlike product it might be unliked already");

    await Products.updateOne({ _id: productId }, { $inc: { saves: -1 } });

    res.status(200).json(responseDto("Product Unsaved"));
  } catch (err: any) {
    res.status(400).json(responseDto(err.message, false));
  }
}

export async function getLikedProducts(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  try {
    const found = await Users.findById(user._id)
      .populate("likes")
      .select("likes")
      .lean()
      .exec();
    res.status(200).json(found?.likes);
  } catch (err) {
    res.status(500).json(responseDto("error getting user lieks", false));
  }
}

export async function getSavedProducts(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  try {
    const found = await Users.findById(user._id)
      .populate("saves")
      .select("saves")
      .lean()
      .exec();
    res.status(200).json(found?.saves);
  } catch (err) {
    res
      .status(500)
      .json(responseDto("error getting user saved products", false));
  }
}

export async function addReview(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  const productId: string = req.params.id;
  const review: IProductReview = req.body;
  try {
    const savedReview = await Reviews.create({
      ...review,
      customer: new mongoose.Types.ObjectId(user._id),
      product: new mongoose.Types.ObjectId(productId),
    }).then((res) => res.toJSON());

    if (!savedReview)
      return res.status(500).json(responseDto("Unable to add review"));

    await Products.updateOne(
      { _id: productId },
      {
        $push: { productReviews: savedReview._id },
        $inc: {
          "productReviewOverview.ratingSum": review.rating,
          "productReviewOverview.totalReviews": 1,
        },
      }
    ).then((res) => console.log(res));

    res.status(200).json(savedReview);
  } catch (err) {
    res.status(400).json("could not save review");
  }
}

export async function followVendor(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  const vendorId = req.params.id;

  try {
    const vendorIsUpdated = !!(
      await Vendors.updateOne(
        { _id: vendorId },
        { $inc: { followersCount: 1 } }
      )
    ).matchedCount;

    if (!vendorIsUpdated) throw new Error("Wrong vendor id");

    const isUpdated = !!(
      await Users.updateOne(
        {
          _id: user._id,
          following: { $ne: new mongoose.Types.ObjectId(vendorId) },
        },
        {
          $push: { following: new mongoose.Types.ObjectId(vendorId) },
        }
      )
    ).matchedCount;

    if (!isUpdated) throw new Error("vendor already followed");

    res.status(200).json(responseDto("vendor followed successfully"));
  } catch (err: any) {
    res.status(400).json(responseDto(err.message));
  }
}

export async function unfollowVendor(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  const vendorId = req.params.id;

  try {
    const isUpdated = await Users.updateOne(
      {
        _id: user._id,
        following: new mongoose.Types.ObjectId(vendorId),
      },
      {
        $pull: { following: new mongoose.Types.ObjectId(vendorId) },
      }
    );

    if (!isUpdated.matchedCount) throw new Error("vendor is not followed");

    await Vendors.updateOne(
      { _id: vendorId },
      { $inc: { followersCount: -1 } }
    );

    res.status(200).json(responseDto("vendor unfollowed successfully"));
  } catch (err: any) {
    res.status(400).json(responseDto(err.message));
  }
}

export async function getFollowingVendors(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  if (!user) return;

  try {
    const foundUser = await Users.findById(user._id)
      .select("following")
      .populate("following")
      .lean()
      .exec();
    if (!foundUser) throw new Error("No user Found");
    res.status(200).json(foundUser.following);
  } catch (err: any) {
    res.status(400).json(responseDto(err.message));
  }
}

export async function getUserInfo(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  if (!user) return;

  try {
    const foundUser = await Users.findById(user._id)
      .select(
        "firstName lastName imageUrl dateOfBirth email gender phone orders"
      )
      .lean()
      .exec();

    if (!foundUser) throw new Error("No user Found");

    const userProfile = {
      dateOfBirthDay: foundUser.dateOfBirth?.day,
      dateOfBirthMonth: foundUser.dateOfBirth?.month,
      dateOfBirthYear: foundUser.dateOfBirth?.year,
      email: foundUser.email,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      gender: foundUser.gender,
      imageUrl: foundUser.imageUrl,
      phone: foundUser.phone,
      ordersCount: foundUser.orders.length,
    };
    res.status(200).json(userProfile);
  } catch (err: any) {
    res.status(400).json(responseDto(err.message));
  }
}

export async function updateInfo(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  const form: IUserInfoBody = req.body;

  if (!user) return;

  try {
    const updateUser = await Users.findByIdAndUpdate(user._id, {
      firstName: form.firstName,
      lastName: form.lastName,
      gender: form.gender,
      imageUrl: form.imageUrl,
      phone: form.phone,
      dateOfBirth: {
        day: form.dateOfBirthDay,
        month: form.dateOfBirthMonth,
        year: form.dateOfBirthYear,
      },
    })
      .select("firstName lastName imageUrl dateOfBirth email gender phone")
      .lean()
      .exec();

    if (!updateUser) throw new Error("No user Found");
    const userProfile = {
      dateOfBirthDay: updateUser.dateOfBirth?.day,
      dateOfBirthMonth: updateUser.dateOfBirth?.month,
      dateOfBirthYear: updateUser.dateOfBirth?.year,
      email: updateUser.email,
      firstName: updateUser.firstName,
      lastName: updateUser.lastName,
      gender: updateUser.gender ?? "",
      imageUrl: updateUser.imageUrl,
      phone: updateUser.phone ?? "",
    };
    res.status(200).json(userProfile);
  } catch (err: any) {
    res.status(400).json(responseDto(err.message));
  }
}

export async function getReviews(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  const page = parseInt(req.query.page?.toString() ?? "1");
  const limit = 5;

  try {
    const reviews = await Reviews.find({
      customer: new mongoose.Types.ObjectId(user._id),
    })
      .populate("customer")
      .populate({
        path: "product",
        select: "name",
      })
      .limit(limit + 1)
      .skip((page - 1) * limit)
      .lean()
      .exec();

    const hasNext = reviews.length > limit && !!reviews.pop();

    res
      .status(200)
      .json(responseDto(reviews, true, { hasNext, limit, current: page }));
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function deleteAdress(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  let addressId = req.params.id;
  console.log(addressId);

  try {
    const x = await Users.findByIdAndUpdate(user._id, {
      $pull: { addresses: { _id: addressId } },
    });
    res.status(200).json({ message: "deleted" });
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function newAdress(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  let address: IAddress = req.body;

  try {
    if (!address.address || !address.city || !address.country)
      throw new Error("should recive address, country and city");

    const updated = await Users.findByIdAndUpdate(user._id, {
      $push: { addresses: { ...address } },
    });
    res.status(200).json(updated);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function editAdress(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  let address: IAddress = req.body;
  let addressId = req.params.id;

  try {
    const updated = await Users.updateOne(
      {
        _id: user._id,
        addresses: {
          $elemMatch: { _id: new mongoose.Types.ObjectId(addressId) },
        },
      },
      {
        $set: {
          "addresses.$.city": address.city,
          "addresses.$.country": address.country,
          "addresses.$.address": address.address,
        },
      }
    );
    res.status(200).json(updated);
  } catch (err: any) {
    res.status(200).json(err.message);
  }
}

export async function getAdresses(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;

  try {
    const foundUser = await Users.findById(user._id)
      .select("addresses")
      .populate("addresses.city addresses.country")
      .lean()
      .exec();

    res.status(200).json(foundUser?.addresses);
  } catch (err: any) {
    res.status(200).json(err.message);
  }
}

export async function changePassword(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  const { password, newPassword } = req.body;

  try {
    const foundUser = await Users.findById(user._id)
      .select("password isLogin")
      .lean()
      .exec();

    const passwordMatching = bcrypt.compareSync(
      password,
      foundUser?.password ?? ""
    );

    if (!passwordMatching) throw new Error("old Password");

    const updated = await Users.updateOne(
      { _id: user._id },
      { password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(8)) }
    );

    if (!updated.modifiedCount)
      throw new Error("Password could not be changed");

    res.status(200).json(foundUser?.addresses);
  } catch (err: any) {
    res.status(200).json(err.message);
  }
}

export async function paymentIntent(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;

  try {
    const foundUser = await Users.findById(user._id)
      .populate("cart.product")
      .lean()
      .exec();
    if (!foundUser) throw new Error("No user Found");

    const cart = foundUser.cart ?? [];

    let total = 25;
    for (const item of cart) total += item.product.price.price * item.quantity;

    if (!STRIPE_SECRET)
      throw new Error("Env failed on server to confirm payment");

    const stripe = new Stripe(STRIPE_SECRET);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(200).json({ paymentSecret: paymentIntent.client_secret });
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function placeOrder(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  const order: {
    billingMethod: string;
    billingStatus: string;
    shippingAddressId: string;
  } = req.body;

  try {
    const foundUser = await Users.findById(user._id)
      .populate("cart.product")
      .lean()
      .exec();
    if (!foundUser) throw new Error("No user Found");

    console.log(foundUser);

    const cart = foundUser.cart ?? [];
    const userAddresses = foundUser.addresses as (IAddress & { _id: string })[];
    const shippingAddress = userAddresses.find(
      (address) => String(address._id) === order.shippingAddressId
    );
    console.log(shippingAddress);

    let total = 0;
    for (const item of cart) total += item.product.price.price * item.quantity;

    const createdOrder = await Orders.create({
      customer: user._id,
      billingStatus: order.billingStatus || "cod",
      billingMethod: order.billingMethod,
      shippingAddress: shippingAddress,
      items: cart,
      subTotal: total,
      totalValue: total + 25,
      shippingFees: 25,
    });

    if (!createdOrder) throw new Error("Could not create Order");

    const userUpdate = await Users.findByIdAndUpdate(user._id, {
      $push: { orders: createdOrder._id },
    });

    if (!userUpdate) throw new Error();

    res.status(200).json(createdOrder);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getOrders(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;

  try {
    const foundUser = await Users.findById(user._id)
      .select("orders")
      .populate(
        // "orders orders.items.product orders.shippingAddress.country orders.shippingAddress.city"
        {
          path: "orders",
          populate:
            "items.product shippingAddress.country shippingAddress.city",
        }
      )
      .lean()
      .exec();
    if (!foundUser?.orders) throw new Error("Could not find User Orders");

    res.status(200).json(foundUser.orders);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getOrdersIds(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;

  try {
    const foundUser = await Users.findById(user._id)
      .select("orders")
      .lean()
      .exec();
    if (!foundUser?.orders) throw new Error("Could not find User Orders");

    res.status(200).json(foundUser.orders);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getOrder(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  let orderId = req.params.id;

  try {
    const order = await Orders.findOne({ customer: user._id, _id: orderId })
      .populate(
        "customer items.product shippingAddress.country shippingAddress.city"
      )
      .lean()
      .exec();
    if (!order) throw new Error("Could not find User Orders");

    res.status(200).json(order);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}
