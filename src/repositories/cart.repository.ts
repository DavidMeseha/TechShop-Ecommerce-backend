import { Types } from 'mongoose';
import Products from '../models/Products';
import Users from '../models/Users';
import { validateAttributes } from '../utils/misc';
import { IProductAttributeDocument } from '../models/supDocumentsSchema';
import { IProductAttribute } from '../interfaces/product.interface';

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
  const productUpdate = await Products.updateOne(
    { _id: productId, usersCarted: { $ne: userId } },
    { $inc: { carts: 1 }, $push: { usersCarted: userId } }
  );

  if (productUpdate.modifiedCount > 0) {
    const _updateUserCart = await Users.updateOne(
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
    );
  } else
    return { isError: true, message: 'Failed to add product to cart, it might be already added' };

  return { isError: false, message: 'Product added to cart' };
}
