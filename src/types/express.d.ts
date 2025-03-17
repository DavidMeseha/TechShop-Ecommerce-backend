import { IUserTokenPayload } from '../interfaces/user.interface';
import { Dictionary } from '../locales/useT';

declare global {
  namespace Express {
    interface Locals {
      user: IUserTokenPayload;
      t: (key: Dictionary) => string;
    }
  }
}
