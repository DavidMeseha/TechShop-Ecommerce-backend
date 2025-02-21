import { Types } from 'mongoose';
import Products from '../models/Products';
import Users from '../models/Users';
import { validateAttributes } from '../utilities';
import { IProductAttributeDocument } from '../models/supDocumentsSchema';
import { IProductAttribute } from '../interfaces/product.interface';

export async function alreadyInCart(userId: string, productId: string) {
  return !Users.findOne({
    _id: userId,
    'cart.product': new Types.ObjectId(productId),
  });
}

export async function validateProductAndAttributes(
  id: string,
  attributes: IProductAttributeDocument[]
) {
  const product = await Products.findById(id)
    .select('productAttributes')
    .lean<{ productAttributes: IProductAttributeDocument[] }>()
    .exec();

  if (!product) return false;
  return validateAttributes(attributes, product.productAttributes);
}

export async function addToCart(
  userId: string,
  productId: string,
  attributes: IProductAttribute[],
  quantity: number
) {
  const [updated, _product] = await Promise.all([
    Users.updateOne(
      { _id: userId },
      {
        $push: {
          cart: {
            product: new Types.ObjectId(productId),
            quantity,
            attributes,
          },
        },
      }
    ),
    Products.findByIdAndUpdate(productId, { $inc: { carts: 1 } }),
  ]);

  if (!updated.matchedCount) return { isError: true, message: 'Failed to add product to cart' };
  return { isError: false, message: 'Product added to cart' };
}
