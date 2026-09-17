// ── Auth ────────────────────────────────────────────────────────────────────
export interface User {
  _id: string;
  email: string;
  name: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ── Transaction ──────────────────────────────────────────────────────────────
export type TransactionCategory = 'Revenue' | 'Expense';
export type TransactionStatus = 'Paid' | 'Pending';

export interface Transaction {
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

// ── Dashboard ────────────────────────────────────────────────────────────────
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

// ── Pagination ───────────────────────────────────────────────────────────────
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ── API Responses ─────────────────────────────────────────────────────────────
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginatedApiResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

// ── Transaction Filters ───────────────────────────────────────────────────────
export interface TransactionFilters {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  category?: TransactionCategory | '';
  status?: TransactionStatus | '';
  user_id?: string;
  sortField?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// ── CSV Export ────────────────────────────────────────────────────────────────
export type ExportField =
  | 'id'
  | 'date'
  | 'amount'
  | 'category'
  | 'status'
  | 'user_id'
  | 'user_profile'
  | 'userName';

export interface ExportConfig {
  fields: ExportField[];
  filters: TransactionFilters;
}
