import { Types } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import { IProductAttributeDocument } from '../models/supDocumentsSchema';

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
  attributes: IProductAttributeDocument[],
  productAttributes: IProductAttributeDocument[] | undefined
): boolean {
  if (!productAttributes) return false;
  const requiredAttributes = productAttributes.map((attribute) => String(attribute._id));
  const providedAttributes = attributes.map((attribute) => String(attribute._id));

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

export function generateVariants(query: string, n: number) {
  let queryRegex = '';

  function replaceChars(currentIndex: number, indicesToReplace: (string | number | any)[]) {
    // If we have selected n indices, create the variant
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

  // Start the recursive function
  replaceChars(0, []);

  // Remove the trailing "|" if necessary
  if (queryRegex.endsWith('|')) {
    queryRegex = queryRegex.slice(0, -1);
  }

  return queryRegex;
}

export function cleanUser(user: IUser) {
  delete user.password;
  delete user.likes;
  delete user.recentProducts;
  delete user.saves;
  delete user.cart;

  return user;
}

export function isValidIdFormat(id: string) {
  return Types.ObjectId.isValid(id);
}
