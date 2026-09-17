import { Response } from 'express';
import { sendSuccess, sendError, sendPaginated } from '../utils/apiResponse';
import asyncHandler from '../utils/asyncHandler';
import { AuthRequest, TransactionFilters } from '../types';
import * as txService from '../services/transactions.service';
import { generateCsv } from '../utils/csvGenerator';

export const getTransactions = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Unauthorized', 'UNAUTHORIZED', 401);

    const q = req.query;

    const filters: TransactionFilters = {
      search: q.search as string | undefined,
      dateFrom: q.dateFrom as string | undefined,
      dateTo: q.dateTo as string | undefined,
      category: q.category as TransactionFilters['category'],
      status: q.status as TransactionFilters['status'],
      user_id: q.user_id as string | undefined,
      sortField: q.sortField as string | undefined,
      sortDir: q.sortDir === 'asc' ? 'asc' : 'desc',
      page: q.page ? parseInt(q.page as string, 10) : 1,
      limit: q.limit ? parseInt(q.limit as string, 10) : 10,
    };

    if (q.amountMin) filters.amountMin = parseFloat(q.amountMin as string);
    if (q.amountMax) filters.amountMax = parseFloat(q.amountMax as string);

    // Validate page/limit
    if (isNaN(filters.page!) || filters.page! < 1) filters.page = 1;
    if (isNaN(filters.limit!) || filters.limit! < 1) filters.limit = 10;
    if (filters.limit! > 100) filters.limit = 100;

    const { transactions, total, page, limit } = await txService.getTransactions(filters);

    return sendPaginated(res, transactions, page, limit, total);
  }
);

export const getTransactionById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Unauthorized', 'UNAUTHORIZED', 401);

    const { id } = req.params;
    if (!id) return sendError(res, 'Transaction ID is required', 'VALIDATION_ERROR', 400);

    const transaction = await txService.getTransactionById(id);
    if (!transaction) {
      return sendError(res, 'Transaction not found', 'NOT_FOUND', 404);
    }

    return sendSuccess(res, transaction);
  }
);

export const exportTransactions = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Unauthorized', 'UNAUTHORIZED', 401);

    const body = req.body as { fields?: string[]; filters?: TransactionFilters };
    const fields = body.fields;
    const filters: TransactionFilters = body.filters ?? {};

    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return sendError(res, 'At least one field must be selected for export', 'VALIDATION_ERROR', 400);
    }

    // Re-use the same filter logic as GET /api/transactions (no pagination)
    const transactions = await txService.getAllForExport(filters);

    const csv = generateCsv(transactions as object[], fields);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `transactions_export_${timestamp}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache');
    return res.send(csv);
  }
);
