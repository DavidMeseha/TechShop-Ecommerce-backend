import { Types } from 'mongoose';
import { IUserDocument } from '../models/Users';
import { IProductAttribute } from '../interfaces/product.interface';

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
  attributes: { _id: string; values: { _id: string }[] }[],
  productAttributes: (IProductAttribute & { _id: string })[] | undefined
): boolean {
  if (!productAttributes) return false;
  const requiredAttributes = productAttributes.map((attribute) => String(attribute._id));
  const providedAttributes = attributes.map((attribute) => String(attribute._id));

  const missingAttributes = requiredAttributes.filter(
    (attribute) => !providedAttributes.includes(attribute)
  );

  if (missingAttributes.length > 0) throw new Error(`Missing required attributes`);

  return true;
}

export const delay = () => {
  return new Promise((resolve) => setTimeout(resolve, 2000));
};

export function mapAttributes(
  attributes: { _id: string; values: { _id: string }[] }[],
  productAttributes: (IProductAttribute & { _id: string })[]
) {
  const mappedAttributes = attributes.map((attribute) => {
    const attributeMatch = productAttributes.find((attr) => {
      return String(attr._id) === attribute._id;
    }) as IProductAttribute;

    const avilableValues = attributeMatch.values;
    const requiredValues = attribute.values.map((value) =>
      avilableValues.find((val) => String(val._id) === value._id)
    );

    return {
      ...attributeMatch,
      values: requiredValues,
    };
  });

  return mappedAttributes as (IProductAttribute & { _id: string })[];
}

export function generateVariants(query: string, n: number) {
  let queryRegex = '';

  function replaceChars(currentIndex: number, indicesToReplace: (string | number | any)[]) {
    if (indicesToReplace.length === n) {
      let variant = query;
      for (const index of indicesToReplace) {
        variant = variant.replace(variant[index], '.');
      }
      queryRegex += variant + '|';
      return;
    }

    // Iterate through the query string to find indices to replace
    for (let i = currentIndex; i < query.length; i++) {
      // Add the current index to the list of indices to replace
      replaceChars(i + 1, [...indicesToReplace, i]);
    }
  }

  replaceChars(0, []);

  if (queryRegex.endsWith('|')) {
    queryRegex = queryRegex.slice(0, -1);
  }

  return queryRegex;
}

export function cleanUser(user: IUserDocument) {
  delete user.password;
  delete user.likes;
  delete user.recentProducts;
  delete user.saves;
  delete user.cart;
  delete user.email;
  delete user.isLogin;

  return user;
}

export function isValidIdFormat(id: string) {
  return Types.ObjectId.isValid(id);
}
