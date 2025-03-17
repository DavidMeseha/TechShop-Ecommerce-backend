import { Request, Response } from 'express';
import { responseDto } from '../../utilities';
import Users from '../../models/Users';
import bcrypt from 'bcrypt-nodejs';

interface UserInfoBody {
  dateOfBirthDay: number;
  dateOfBirthMonth: number;
  dateOfBirthYear: number;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  imageUrl: string;
  phone: string;
}

export async function getUserInfo(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';

  try {
    const foundUser = await Users.findById(userId)
      .select('firstName lastName imageUrl dateOfBirth email gender phone orders')
      .lean()
      .exec();

    if (!foundUser) {
      return res.status(404).json(responseDto('User not found'));
    }

    return res.status(200).json({
      dateOfBirthDay: foundUser.dateOfBirth?.day,
      dateOfBirthMonth: foundUser.dateOfBirth?.month,
      dateOfBirthYear: foundUser.dateOfBirth?.year,
      email: foundUser.email,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      gender: foundUser.gender,
      imageUrl: foundUser.imageUrl,
      phone: foundUser.phone,
      ordersCount: foundUser.orders.length,
    });
  } catch (error) {
    console.error('Error getting user info:', error);
    return res.status(500).json(responseDto('Failed to get user information'));
  }
}

export async function updateInfo(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';
  const form: UserInfoBody = req.body;

  try {
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

    if (!updateUser) throw new Error('No user Found');
    const userProfile = {
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
    res.status(200).json(userProfile);
  } catch (err: any) {
    res.status(400).json(responseDto(err.message));
  }
}

export async function changePassword(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';
  const { password, newPassword } = req.body;

  try {
    const foundUser = await Users.findById(userId).select('password isLogin').lean().exec();

    const passwordMatching = bcrypt.compareSync(password, foundUser?.password ?? '');

    if (!passwordMatching) throw new Error('old Password');

    const updated = await Users.updateOne(
      { _id: userId },
      { password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(8)) }
    );

    if (!updated.modifiedCount) throw new Error('Password could not be changed');

    res.status(200).json(foundUser?.addresses);
  } catch (err: any) {
    res.status(200).json(err.message);
  }
}
