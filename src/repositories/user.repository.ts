import { IUser } from '../interfaces/user.interface';
import Users from '../models/Users';

async function findUserById(id: string): Promise<IUser | null> {
  return Users.findById(id)
    .select('firstName lastName imageUrl email isRegistered isLogin isVendor language')
    .then((user) => user?.toJSON() || null);
}

async function createGuestUser(): Promise<IUser | null> {
  return Users.create({
    isRegistered: false,
    isVendor: false,
  }).then((user) => user.toJSON());
}

async function createUser(user: Partial<IUser>): Promise<IUser | null> {
  return Users.create(user).then((user) => user.toJSON());
}

async function logout(id: string): Promise<void> {
  await Users.updateOne({ _id: id }, { isLogin: false });
}

async function findUserByEmail(email: string) {
  return Users.findOne({ email })
    .select('_id firstName lastName email imageUrl isRegistered isVendor language password')
    .then((result) => result?.toJSON());
}

export default {
  logout,
  createUser,
  createGuestUser,
  findUserByEmail,
  findUserById,
};
