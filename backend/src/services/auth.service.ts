import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.model';
import { AuthPayload } from '../types';

const JWT_EXPIRY = '24h';

export const generateToken = (user: IUser): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');

  const payload: AuthPayload = {
    userId: (user._id as string).toString(),
    email: user.email,
  };

  return jwt.sign(payload, secret, { expiresIn: JWT_EXPIRY });
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ token: string; user: Omit<IUser, 'password'> }> => {
  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    throw Object.assign(new Error('Invalid email or password'), {
      statusCode: 401,
      code: 'INVALID_CREDENTIALS',
    });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw Object.assign(new Error('Invalid email or password'), {
      statusCode: 401,
      code: 'INVALID_CREDENTIALS',
    });
  }

  const token = generateToken(user);
  const userObj = user.toJSON() as Omit<IUser, 'password'>;

  return { token, user: userObj };
};

export const getUserById = async (userId: string): Promise<IUser | null> => {
  return User.findById(userId).select('-password');
};
