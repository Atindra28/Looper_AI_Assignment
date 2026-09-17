import api from './api';
import { SummaryData, TrendDataPoint, CategoryDataPoint, Transaction } from '../types';

export const dashboardService = {
  getSummary: async (): Promise<SummaryData> => {
    const res = await api.get<{ success: boolean; data: SummaryData }>('/dashboard/summary');
    return res.data.data;
  },

  getTrends: async (year?: number): Promise<TrendDataPoint[]> => {
    const params = year ? { year } : {};
    const res = await api.get<{ success: boolean; data: TrendDataPoint[] }>(
      '/dashboard/trends',
      { params }
    );
    return res.data.data;
  },

  getCategories: async (): Promise<CategoryDataPoint[]> => {
    const res = await api.get<{ success: boolean; data: CategoryDataPoint[] }>(
      '/dashboard/categories'
    );
    return res.data.data;
  },

  getRecent: async (): Promise<Transaction[]> => {
    const res = await api.get<{ success: boolean; data: Transaction[] }>(
      '/dashboard/recent'
    );
    return res.data.data;
  },
};
