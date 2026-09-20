import { SignOptions } from 'jsonwebtoken';
import { env } from '../env';

export const authConfig: {
  jwt: {
    secret: string;
    expiresIn: SignOptions['expiresIn'];
  };
} = {
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: '1d',
  },
};
