import { Request, Response } from "express";
import Products from "../models/Products";
import { responseDto } from "../utilities";
import mongoose from "mongoose";
import Reviews from "../models/Reviews";

export async function getProductAtterputes(req: Request, res: Response) {
  const id = req.params.id;

  const product = await Products.findById(id)
    .select("productAttributes name")
    .lean()
    .exec();

  res.status(200).json(product);
}

export async function getProductDetails(req: Request, res: Response) {
  const id = req.params.id;

  try {
    const product = await Products.findById(id)
      .populate("vendor")
      .select("-productReviews")
      .lean()
      .exec();

    if (!product) return res.status(404).json(responseDto("No product found"));
    res.status(200).json(product);
  } catch (err: any) {
    res.status(404).json(responseDto(err.message));
  }
}

export async function getReviews(req: Request, res: Response) {
  const id = req.params.id;

  try {
    const reviews = await Reviews.find({
      product: new mongoose.Types.ObjectId(id),
    })
      .populate({ path: "customer", select: "firstName lastName imageUrl" })
      .lean()
      .exec();

    if (reviews.length < 1)
      return res.status(404).json(responseDto("No reviews found"));
    res.status(200).json(reviews);
  } catch (err: any) {
    res.status(404).json(responseDto(err.message));
  }
}
