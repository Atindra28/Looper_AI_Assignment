import api from './api';
import { Transaction, PaginatedApiResponse, TransactionFilters } from '../types';

export const transactionsService = {
  getAll: async (
    filters: TransactionFilters = {}
  ): Promise<PaginatedApiResponse<Transaction>> => {
    // Remove empty/undefined values before sending
    const params: Record<string, string | number> = {};
    (Object.keys(filters) as (keyof TransactionFilters)[]).forEach((key) => {
      const val = filters[key];
      if (val !== undefined && val !== '' && val !== null) {
        params[key] = val as string | number;
      }
    });
    const res = await api.get<PaginatedApiResponse<Transaction>>('/transactions', {
      params,
    });
    return res.data;
  },

  getById: async (id: string): Promise<Transaction> => {
    const res = await api.get<{ success: boolean; data: Transaction }>(
      `/transactions/${id}`
    );
    return res.data.data;
  },

  exportCsv: async (
    fields: string[],
    filters: TransactionFilters = {}
  ): Promise<Blob> => {
    const params: Record<string, string | number> = {};
    (Object.keys(filters) as (keyof TransactionFilters)[]).forEach((key) => {
      const val = filters[key];
      if (val !== undefined && val !== '' && val !== null) {
        params[key] = val as string | number;
      }
    });

    const res = await api.post(
      '/transactions/export',
      { fields, filters },
      { responseType: 'blob' }
    );
    return res.data as Blob;
  },
};
