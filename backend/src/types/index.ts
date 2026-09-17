import { Request } from 'express';

export interface AuthPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

export type TransactionCategory = 'Revenue' | 'Expense';
export type TransactionStatus = 'Paid' | 'Pending';

export interface TransactionFilters {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  category?: TransactionCategory;
  status?: TransactionStatus;
  user_id?: string;
  sortField?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SummaryData {
  totalRevenue: number;
  totalExpenses: number;
  balance: number;
  savings: number;
  revenueChange: number;
  expensesChange: number;
  balanceChange: number;
  savingsChange: number;
}

export interface TrendDataPoint {
  month: string;
  monthNum: number;
  year: number;
  revenue: number;
  expenses: number;
}

export interface CategoryDataPoint {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

export interface RecentTransaction {
  _id: string;
  id: number;
  date: string;
  amount: number;
  category: TransactionCategory;
  status: TransactionStatus;
  user_id: string;
  user_profile: string;
  userName: string;
}
