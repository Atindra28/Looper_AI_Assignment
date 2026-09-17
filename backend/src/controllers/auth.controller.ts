import { Request, Response } from 'express';
import { loginUser, getUserById } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/apiResponse';
import asyncHandler from '../utils/asyncHandler';
import { AuthRequest } from '../types';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return sendError(res, 'Email and password are required', 'VALIDATION_ERROR', 400);
  }

  if (typeof email !== 'string' || typeof password !== 'string') {
    return sendError(res, 'Invalid request format', 'VALIDATION_ERROR', 400);
  }

  const { token, user } = await loginUser(email, password);
  return sendSuccess(res, { token, user });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  // JWT is stateless — logout is handled client-side by deleting the token.
  // This endpoint exists for completeness and future blacklist implementation.
  return sendSuccess(res, { message: 'Logged out successfully' });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return sendError(res, 'Not authenticated', 'UNAUTHORIZED', 401);
  }

  const user = await getUserById(req.user.userId);
  if (!user) {
    return sendError(res, 'User not found', 'NOT_FOUND', 404);
  }

  return sendSuccess(res, { user });
});
