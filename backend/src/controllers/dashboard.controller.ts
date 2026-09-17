import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse';
import asyncHandler from '../utils/asyncHandler';
import { AuthRequest } from '../types';
import * as dashboardService from '../services/dashboard.service';

export const getSummary = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Unauthorized', 'UNAUTHORIZED', 401);
  const data = await dashboardService.getSummary();
  return sendSuccess(res, data);
});

export const getTrends = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Unauthorized', 'UNAUTHORIZED', 401);
  const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
  if (year && (isNaN(year) || year < 2000 || year > 2100)) {
    return sendError(res, 'Invalid year parameter', 'VALIDATION_ERROR', 400);
  }
  const data = await dashboardService.getTrends(year);
  return sendSuccess(res, data);
});

export const getCategories = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Unauthorized', 'UNAUTHORIZED', 401);
  const data = await dashboardService.getCategories();
  return sendSuccess(res, data);
});

export const getRecentTransactions = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Unauthorized', 'UNAUTHORIZED', 401);
    const data = await dashboardService.getRecentTransactions();
    return sendSuccess(res, data);
  }
);
