import { Types } from 'mongoose';
import { IOrder, IUser, UserInfoBody } from '@/types/user.interface';
import Orders from '@/models/Orders';
import Reviews from '@/models/Reviews';
import Users, { IUserDocument } from '@/models/Users';
import bcrypt from 'bcrypt-nodejs';
import Products from '@/models/Products';
import createProductsPipeline from '@/pipelines/products.aggregation';
import { IFullProduct } from '@/types/product.interface';
import { AppError } from '@/utils/appErrors';

export async function findUserById(id: string) {
  return Users.findById(id)
    .select('firstName lastName imageUrl email isRegistered isLogin isVendor language')
    .then((user) => user?.toJSON() || null);
}

export async function userInformation(userId: string) {
  const user = await Users.findById(userId)
    .select('firstName lastName imageUrl dateOfBirth email gender phone orders')
    .lean<
      Pick<
        IUser,
        | 'firstName'
        | 'lastName'
        | 'dateOfBirth'
        | 'email'
        | 'gender'
        | 'imageUrl'
        | 'phone'
        | 'orders'
      > & { _id: string }
    >();

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

export async function createGuestUser(): Promise<IUserDocument> {
  return Users.create({
    isRegistered: false,
    isVendor: false,
  }).then((user) => user.toJSON());
}

export async function updatePassword(userId: string, password: string, newPassword: string) {
  const foundUser = await Users.findById(userId).select('password isLogin').lean().exec();
  const passwordMatching = bcrypt.compareSync(password, foundUser?.password ?? '');
  if (!passwordMatching) throw new AppError('Wrong credintials', 401);

  const updated = await Users.updateOne(
    { _id: userId },
    { password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(8)) }
  );

  if (!updated.modifiedCount) throw new AppError('Password could not be changed', 500);
}

export async function createUser(user: Partial<IUser>): Promise<IUser | null> {
  return Users.create(user).then((user) => user.toJSON());
}

export async function logoutUser(id: string): Promise<void> {
  await Users.updateOne({ _id: id }, { isLogin: false });
}

export async function findUserByEmail(email: string) {
  return Users.findOne({ email })
    .select('_id firstName lastName imageUrl isRegistered isVendor language password')
    .lean<
      Pick<
        IUser,
        'firstName' | 'lastName' | 'imageUrl' | 'isRegistered' | 'isVendor' | 'language'
      > & { password?: string; _id: string }
    >();
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

export async function userOrders(userId: string, { page, limit }: { page: number; limit: number }) {
  const user = await Users.findById(userId)
    .select('orders')
    .populate({
      path: 'orders',
      select: '-items.attributes',
      populate: [
        {
          path: 'items.product',
          select: 'name seName', // Only select name and seName fields
        },
        {
          path: 'shippingAddress.country',
          select: '-cities', // Exclude cities array
        },
        {
          path: 'shippingAddress.city',
        },
      ],
    })
    .limit(limit)
    .skip((page - 1) * limit)
    .lean<{ orders: IOrder[] }>();

  if (!user) throw new AppError('Could not find User Orders', 500);

  return user.orders;
}

export async function orderDetails(userId: string, orderId: string) {
  if (!Types.ObjectId.isValid(orderId)) throw new AppError('valid orderId is Required', 400);

  const order = await Orders.findOne({ customer: userId, _id: orderId })
    .populate([
      {
        path: 'customer',
        select: '_id email lastName firstName imageUrl',
      },
      {
        path: 'items.product',
        select: 'seName name inStock vendor category pictures price',
        populate: [
          { path: 'vendor', select: '-usersFollowed -followersCount' },
          { path: 'category' },
        ],
      },
      {
        path: 'shippingAddress.country',
        select: '-cities',
      },
      {
        path: 'shippingAddress.city',
      },
    ])
    .exec();

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
    .select('-customer -updatedAt -__v')
    .populate({
      path: 'product',
      select: 'name seName',
    })
    .limit(limit + 1)
    .skip((page - 1) * limit)
    .lean<
      {
        _id: string;
        product: { _id: string; name: string; seName: string };
        reviewText: string;
        rating: number;
        createdAt: string;
      }[]
    >();

  return reviews;
}

export async function savedProducts(userId: string) {
  const pipline = createProductsPipeline(userId, 1, 25, [
    {
      $match: {
        usersSaved: userId,
      },
    },
    {
      $project: {
        productctAttributes: 0,
        productReviews: 0,
      },
    },
  ]);

  const products = await Products.aggregate<IFullProduct[]>(pipline).exec();

  return products;
}
