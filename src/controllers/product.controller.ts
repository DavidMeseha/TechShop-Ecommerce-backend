import { Request, Response } from "express";
import mongoose from "mongoose";
import Products from "../models/Products";
import Reviews from "../models/Reviews";
import { responseDto } from "../utilities";

interface ProductControllerResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Get product attributes by product ID
 */
export async function getProductAtterputes(
  req: Request,
  res: Response
): Promise<Response<ProductControllerResponse>> {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(responseDto("Invalid product ID"));
  }

  try {
    const product = await Products.findById(id)
      .select("productAttributes name")
      .lean()
      .exec();

    if (!product) {
      return res.status(404).json(responseDto("Product not found"));
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product attributes:", error);
    return res.status(500).json(responseDto("Failed to fetch product attributes"));
  }
}

/**
 * Get product details by SEO name
 */
export async function getProductDetails(
  req: Request,
  res: Response
): Promise<Response<ProductControllerResponse>> {
  const { seName } = req.params;

  if (!seName) {
    return res.status(400).json(responseDto("SEO name is required"));
  }

  try {
    const product = await Products.findOne({ seName })
      .populate([
        { path: "vendor" },
        { path: "category" },
        { path: "productTags" }
      ])
      .select("-productReviews")
      .lean()
      .exec();

    if (!product) {
      return res.status(404).json(responseDto("Product not found"));
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product details:", error);
    return res.status(500).json(responseDto("Failed to fetch product details"));
  }
}

/**
 * Get product reviews by product ID
 */
export async function getReviews(
  req: Request,
  res: Response
): Promise<Response<ProductControllerResponse>> {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(responseDto("Invalid product ID"));
  }

  try {
    const reviews = await Reviews.find({
      product: new mongoose.Types.ObjectId(id)
    })
      .populate({
        path: "customer",
        select: "firstName lastName imageUrl"
      })
      .lean()
      .exec();

    return res.status(200).json(reviews ?? []);
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return res.status(500).json(responseDto("Failed to fetch product reviews"));
  }
}
