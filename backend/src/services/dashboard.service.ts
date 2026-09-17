import Transaction from '../models/Transaction.model';
import {
  SummaryData,
  TrendDataPoint,
  CategoryDataPoint,
  RecentTransaction,
} from '../types';
import { getUserName } from '../utils/userNames';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Aggregate total revenue, expenses, balance and savings for all time,
 * plus month-over-month percentage changes for the most recent month.
 */
export const getSummary = async (): Promise<SummaryData> => {
  // Overall totals
  const totalsAgg = await Transaction.aggregate([
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
      },
    },
  ]);

  let totalRevenue = 0;
  let totalExpenses = 0;
  for (const row of totalsAgg) {
    if (row._id === 'Revenue') totalRevenue = row.total;
    if (row._id === 'Expense') totalExpenses = row.total;
  }
  const balance = totalRevenue - totalExpenses;
  const savings = balance; // Savings = Revenue - Expenses (net income)

  // Most recent month in the dataset
  const latestTx = await Transaction.findOne().sort({ date: -1 }).select('date');
  const referenceDate = latestTx ? latestTx.date : new Date();
  const currentYear = referenceDate.getFullYear();
  const currentMonth = referenceDate.getMonth() + 1; // 1-based

  // Previous month
  let prevMonth = currentMonth - 1;
  let prevYear = currentYear;
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear = currentYear - 1;
  }

  // Current and previous month aggregations
  const monthlyAgg = await Transaction.aggregate([
    {
      $match: {
        $expr: {
          $or: [
            {
              $and: [
                { $eq: [{ $year: '$date' }, currentYear] },
                { $eq: [{ $month: '$date' }, currentMonth] },
              ],
            },
            {
              $and: [
                { $eq: [{ $year: '$date' }, prevYear] },
                { $eq: [{ $month: '$date' }, prevMonth] },
              ],
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          category: '$category',
        },
        total: { $sum: '$amount' },
      },
    },
  ]);

  const getMonthTotal = (year: number, month: number, cat: string): number => {
    const row = monthlyAgg.find(
      (r) => r._id.year === year && r._id.month === month && r._id.category === cat
    );
    return row ? row.total : 0;
  };

  const currRevenue = getMonthTotal(currentYear, currentMonth, 'Revenue');
  const currExpenses = getMonthTotal(currentYear, currentMonth, 'Expense');
  const prevRevenue = getMonthTotal(prevYear, prevMonth, 'Revenue');
  const prevExpenses = getMonthTotal(prevYear, prevMonth, 'Expense');

  const pctChange = (curr: number, prev: number): number => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 100 * 10) / 10;
  };

  const currBalance = currRevenue - currExpenses;
  const prevBalance = prevRevenue - prevExpenses;

  return {
    totalRevenue,
    totalExpenses,
    balance,
    savings,
    revenueChange: pctChange(currRevenue, prevRevenue),
    expensesChange: pctChange(currExpenses, prevExpenses),
    balanceChange: pctChange(currBalance, prevBalance),
    savingsChange: pctChange(currBalance, prevBalance),
  };
};

/**
 * Monthly revenue vs expenses trend for a given year.
 * Returns 12 data points (one per month), even if a month has no data.
 */
export const getTrends = async (year?: number): Promise<TrendDataPoint[]> => {
  // Default to the year of the most recent transaction
  let targetYear = year;
  if (!targetYear) {
    const latest = await Transaction.findOne().sort({ date: -1 }).select('date');
    targetYear = latest ? latest.date.getFullYear() : new Date().getFullYear();
  }

  const agg = await Transaction.aggregate([
    {
      $match: {
        $expr: { $eq: [{ $year: '$date' }, targetYear] },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: '$date' },
          category: '$category',
        },
        total: { $sum: '$amount' },
      },
    },
  ]);

  // Build full 12-month array
  const result: TrendDataPoint[] = [];
  for (let m = 1; m <= 12; m++) {
    const revRow = agg.find((r) => r._id.month === m && r._id.category === 'Revenue');
    const expRow = agg.find((r) => r._id.month === m && r._id.category === 'Expense');
    result.push({
      month: MONTH_NAMES[m - 1],
      monthNum: m,
      year: targetYear,
      revenue: revRow ? Math.round(revRow.total * 100) / 100 : 0,
      expenses: expRow ? Math.round(expRow.total * 100) / 100 : 0,
    });
  }

  return result;
};

/**
 * Revenue vs Expense category breakdown — totals, counts, percentages.
 */
export const getCategories = async (): Promise<CategoryDataPoint[]> => {
  const agg = await Transaction.aggregate([
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  const grandTotal = agg.reduce((sum, r) => sum + r.total, 0);

  return agg
    .map((r) => ({
      category: r._id as string,
      total: Math.round(r.total * 100) / 100,
      count: r.count as number,
      percentage:
        grandTotal > 0
          ? Math.round((r.total / grandTotal) * 100 * 10) / 10
          : 0,
    }))
    .sort((a, b) => b.total - a.total);
};

/**
 * Fetch the 5 most recent transactions for the dashboard panel.
 */
export const getRecentTransactions = async (): Promise<RecentTransaction[]> => {
  const txs = await Transaction.find().sort({ date: -1 }).limit(5).lean();

  return txs.map((t) => ({
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
