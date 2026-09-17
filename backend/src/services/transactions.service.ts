import Transaction, { ITransaction } from '../models/Transaction.model';
import { TransactionFilters, RecentTransaction } from '../types';
import { getUserName } from '../utils/userNames';
import { FilterQuery } from 'mongoose';

interface TransactionWithName extends ITransaction {
  userName: string;
}

const ALLOWED_SORT_FIELDS: Record<string, string> = {
  date: 'date',
  amount: 'amount',
  category: 'category',
  status: 'status',
  user_id: 'user_id',
  id: 'id',
};

/**
 * Build a Mongoose filter query from the provided filter params.
 * Designed so Part 2 can extend with additional filter types.
 */
export const buildFilterQuery = (
  filters: TransactionFilters
): FilterQuery<ITransaction> => {
  const query: FilterQuery<ITransaction> = {};

  // Date range
  if (filters.dateFrom || filters.dateTo) {
    query.date = {};
    if (filters.dateFrom) query.date.$gte = new Date(filters.dateFrom);
    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      to.setHours(23, 59, 59, 999);
      query.date.$lte = to;
    }
  }

  // Amount range
  if (filters.amountMin !== undefined || filters.amountMax !== undefined) {
    query.amount = {};
    if (filters.amountMin !== undefined) query.amount.$gte = filters.amountMin;
    if (filters.amountMax !== undefined) query.amount.$lte = filters.amountMax;
  }

  // Exact category
  if (filters.category) query.category = filters.category;

  // Exact status
  if (filters.status) query.status = filters.status;

  // Exact user_id
  if (filters.user_id) query.user_id = filters.user_id;

  // Text search across id, date, amount, category, status, user_id
  if (filters.search) {
    const term = filters.search.trim();
    const regex = { $regex: term, $options: 'i' };
    const orClauses: FilterQuery<ITransaction>[] = [
      { user_id: regex },
      { category: regex },
      { status: regex },
    ];
    // Numeric id match
    const numericId = Number(term);
    if (!isNaN(numericId) && numericId > 0) {
      orClauses.push({ id: numericId });
      orClauses.push({ amount: numericId });
    }
    // Partial amount match via string representation
    const amountRegex = { $regex: `^${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, $options: '' };
    // MongoDB can't regex a Number field directly, so amount is handled via the
    // numeric equality above. Date is searched as ISO string via a $expr/$toString.
    orClauses.push({
      $expr: {
        $regexMatch: {
          input: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          regex: term,
          options: 'i',
        },
      },
    } as FilterQuery<ITransaction>);
    query.$or = orClauses;
  }

  return query;
};

export const getTransactions = async (
  filters: TransactionFilters
): Promise<{
  transactions: (RecentTransaction & { _id: string })[];
  total: number;
  page: number;
  limit: number;
}> => {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 10));
  const skip = (page - 1) * limit;

  const sortField = ALLOWED_SORT_FIELDS[filters.sortField ?? 'date'] ?? 'date';
  const sortDir = filters.sortDir === 'asc' ? 1 : -1;
  const sortObj: Record<string, 1 | -1> = { [sortField]: sortDir };

  const query = buildFilterQuery(filters);

  const [transactions, total] = await Promise.all([
    Transaction.find(query).sort(sortObj).skip(skip).limit(limit).lean(),
    Transaction.countDocuments(query),
  ]);

  const mapped = transactions.map((t) => ({
    _id: t._id.toString(),
    id: t.id,
    date: t.date.toISOString(),
    amount: t.amount,
    category: t.category,
    status: t.status,
    user_id: t.user_id,
    user_profile: t.user_profile,
    userName: getUserName(t.user_id),
  }));

  return { transactions: mapped, total, page, limit };
};

export const getTransactionById = async (
  mongoId: string
): Promise<(RecentTransaction & { _id: string }) | null> => {
  const t = await Transaction.findById(mongoId).lean();
  if (!t) return null;

  return {
    _id: t._id.toString(),
    id: t.id,
    date: t.date.toISOString(),
    amount: t.amount,
    category: t.category,
    status: t.status,
    user_id: t.user_id,
    user_profile: t.user_profile,
    userName: getUserName(t.user_id),
  };
};

/**
 * Fetch all transactions matching filters (no pagination) — used for CSV export.
 * Part 2 will wire this to the export endpoint.
 */
export const getAllForExport = async (
  filters: TransactionFilters
): Promise<(RecentTransaction & { _id: string })[]> => {
  const query = buildFilterQuery(filters);
  const transactions = await Transaction.find(query)
    .sort({ date: -1 })
    .limit(50000)
    .lean();

  return transactions.map((t) => ({
    _id: t._id.toString(),
    id: t.id,
    date: t.date.toISOString(),
    amount: t.amount,
    category: t.category,
    status: t.status,
    user_id: t.user_id,
    user_profile: t.user_profile,
    userName: getUserName(t.user_id),
  }));
};
