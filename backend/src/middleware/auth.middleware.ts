import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, AuthPayload } from '../types';
import { sendError } from '../utils/apiResponse';

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'No authentication token provided', 'UNAUTHORIZED', 401);
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    sendError(res, 'Server configuration error', 'SERVER_ERROR', 500);
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as AuthPayload;
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      sendError(res, 'Authentication token has expired', 'TOKEN_EXPIRED', 401);
    } else {
      sendError(res, 'Invalid authentication token', 'INVALID_TOKEN', 401);
    }
  }
};
