import { Types } from 'mongoose';
import { IUser, UserInfoBody } from '../interfaces/user.interface';
import Orders from '../models/Orders';
import Reviews from '../models/Reviews';
import Users from '../models/Users';
import bcrypt from 'bcrypt-nodejs';
import Products from '../models/Products';
import createProductsPipeline from '../pipelines/products.aggregation';
import { IFullProduct } from '../interfaces/product.interface';
import { AppError } from '../utils/appErrors';

export async function findUserById(id: string): Promise<IUser | null> {
  return Users.findById(id)
    .select('firstName lastName imageUrl email isRegistered isLogin isVendor language')
    .then((user) => user?.toJSON() || null);
}

export async function userInformation(userId: string) {
  const user = await Users.findById(userId)
    .select('firstName lastName imageUrl dateOfBirth email gender phone orders')
    .lean()
    .exec();

  if (!user) return null;

  return {
    dateOfBirthDay: user.dateOfBirth?.day,
    dateOfBirthMonth: user.dateOfBirth?.month,
    dateOfBirthYear: user.dateOfBirth?.year,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    gender: user.gender,
    imageUrl: user.imageUrl,
    phone: user.phone,
    ordersCount: user.orders.length,
  };
}

export async function createGuestUser(): Promise<IUser | null> {
  return Users.create({
    isRegistered: false,
    isVendor: false,
  }).then((user) => user.toJSON());
}

export async function updatePassword(userId: string, password: string, newPassword: string) {
  const foundUser = await Users.findById(userId).select('password isLogin').lean().exec();

  const passwordMatching = bcrypt.compareSync(password, foundUser?.password ?? '');

  if (!passwordMatching) throw new Error('old Password');

  const updated = await Users.updateOne(
    { _id: userId },
    { password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(8)) }
  );

  if (!updated.modifiedCount) throw new Error('Password could not be changed');
}

export async function createUser(user: Partial<IUser>): Promise<IUser | null> {
  return Users.create(user).then((user) => user.toJSON());
}

export async function logoutUser(id: string): Promise<void> {
  await Users.updateOne({ _id: id }, { isLogin: false });
}

export async function findUserByEmail(email: string) {
  return Users.findOne({ email })
    .select('_id firstName lastName email imageUrl isRegistered isVendor language password')
    .then((result) => result?.toJSON());
}

export async function updateUserInformation(userId: string, form: UserInfoBody) {
  const updateUser = await Users.findByIdAndUpdate(userId, {
    firstName: form.firstName,
    lastName: form.lastName,
    gender: form.gender,
    imageUrl: form.imageUrl,
    phone: form.phone,
    dateOfBirth: {
      day: form.dateOfBirthDay,
      month: form.dateOfBirthMonth,
      year: form.dateOfBirthYear,
    },
  })
    .select('firstName lastName imageUrl dateOfBirth email gender phone')
    .lean()
    .exec();

  if (!updateUser) throw new AppError('No user Found', 404);

  return {
    dateOfBirthDay: updateUser.dateOfBirth?.day,
    dateOfBirthMonth: updateUser.dateOfBirth?.month,
    dateOfBirthYear: updateUser.dateOfBirth?.year,
    email: updateUser.email,
    firstName: updateUser.firstName,
    lastName: updateUser.lastName,
    gender: updateUser.gender ?? '',
    imageUrl: updateUser.imageUrl,
    phone: updateUser.phone ?? '',
  };
}

export async function userOrders(userId: string) {
  const user = await Users.findById(userId)
    .select('orders')
    .populate(
      // "orders orders.items.product orders.shippingAddress.country orders.shippingAddress.city"
      {
        path: 'orders',
        populate: 'items.product shippingAddress.country shippingAddress.city',
      }
    )
    .lean()
    .exec();

  if (!user) throw new Error('Could not find User Orders');

  return user.orders;
}

export async function orderDetails(userId: string, orderId: string) {
  const order = await Orders.findOne({ customer: userId, _id: orderId })
    .populate('customer items.product shippingAddress.country shippingAddress.city')
    .exec();

  if (!order) throw new Error('Could not find Order');

  return order;
}

interface UserReviewsProps {
  limit: number;
  page: number;
}

export async function userReviews(userId: string, { limit, page }: UserReviewsProps) {
  const reviews = await Reviews.find({
    customer: new Types.ObjectId(userId),
  })
    .populate('customer')
    .populate({
      path: 'product',
      select: 'name',
    })
    .limit(limit + 1)
    .skip((page - 1) * limit)
    .exec();

  return reviews;
}

export async function savedProducts(userId: string) {
  const pipline = createProductsPipeline(userId, 1, 100, [
    {
      $match: {
        usersSaved: userId,
      },
    },
  ]);

  const products = await Products.aggregate<IFullProduct[]>(pipline).exec();

  return products;
}
