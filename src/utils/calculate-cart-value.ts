import { ProductListItem } from '@/types/product.interface';
import { IUserCart } from '@/types/user.interface';

export default function calculateCartValue(cart: IUserCart<ProductListItem>[]) {
  const total = cart.reduce(
    (sum, item) =>
      typeof item.product === 'object' && 'price' in item.product
        ? sum + item.product.price.price * item.quantity
        : 0,
    0
  );

  return total;
}
