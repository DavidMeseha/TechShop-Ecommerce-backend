import mongoose from "mongoose";
import { IProductAttribute } from "./global-types";

export function responseDto<T>(
  response: T,
  success: boolean = false,
  page?: { current: number; limit: number; hasNext: boolean }
): {
  data?: T;
  message?: T;
  pages?: {
    current: number;
    limit: number;
    hasNext: boolean;
  };
} {
  if (page && success)
    return {
      data: response,
      pages: {
        current: page.current,
        limit: page.limit,
        hasNext: page.hasNext,
      },
    };
  else if (success)
    return {
      data: response,
    };
  else
    return {
      message: response,
    };
}

export function validateAttributes(
  selected: (IProductAttribute & mongoose.Document)[],
  product: (IProductAttribute & mongoose.Document)[]
) {
  const requiredAttributes = product.map((attribute) => String(attribute._id));
  const providedAttributes = selected.map((attribute) => attribute._id);

  const missingAttributes = requiredAttributes.filter(
    (attribute) => !providedAttributes.includes(attribute)
  );

  if (missingAttributes.length > 0) {
    throw new Error(`Missing required attributes`);
  }

  return true;
}

export const delay = () => {
  return new Promise((resolve) => setTimeout(resolve, 2000));
};
