import { IFullProduct } from '../interfaces/product.interface';
import { IUserCart } from '../interfaces/user.interface';

export default function calculateCartValue(cart: IUserCart<IFullProduct>[]) {
  const total = cart.reduce(
    (sum, item) =>
      typeof item.product === 'object' && 'price' in item.product
        ? sum + item.product.price.price * item.quantity
        : 0,
    25 // Base shipping fee
  );

  return total;
}
