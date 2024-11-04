import { Request, Response } from "express";
import Products from "../models/Products";
import { IUserTokenPayload } from "../global-types";

interface NewProduct {
  name: string;
  description: string;
  stock_quantity: number;
  price: number;
  old_price: number;
  pictures: string[];
  tags: string[];
}

export async function createProduct(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  const product: NewProduct = req.body;

  try {
  } catch {}
  res.status(200).json(product);
}
