import { IUserTokenPayload } from './user.interface';
import { Dictionary } from '@/locales/useT';

declare global {
  namespace Express {
    interface Locals {
      user: IUserTokenPayload;
      userId: string;
      t: (key: Dictionary) => string;
    }
  }
}
