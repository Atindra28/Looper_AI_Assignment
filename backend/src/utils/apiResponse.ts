import { Response } from 'express';

export const sendSuccess = <T>(res: Response, data: T, statusCode = 200): Response => {
  return res.status(statusCode).json({ success: true, data });
};

export const sendError = (
  res: Response,
  message: string,
  code: string,
  statusCode = 500
): Response => {
  return res.status(statusCode).json({
    success: false,
    error: { code, message },
  });
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number
): Response => {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};
