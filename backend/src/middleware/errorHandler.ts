import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode ?? 500;
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'An internal server error occurred'
      : err.message || 'An unexpected error occurred';

  console.error(`[${new Date().toISOString()}] Error:`, err.message, err.stack);

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code ?? 'SERVER_ERROR',
      message,
    },
  });
};

export default errorHandler;
