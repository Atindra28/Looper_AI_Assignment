import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import { Transaction, PaginationMeta, TransactionFilters } from '../../types';
import { transactionsService } from '../../services/transactions.service';
import TransactionsTable from '../../components/transactions/TransactionsTable';
import TransactionFiltersBar from '../../components/transactions/TransactionFilters';
import { AlertChip, useAlert } from '../../components/common/AlertChip';
import { useDebounce } from '../../hooks/useDebounce';
import ExportModal from '../../components/export/ExportModal';
import { COLORS } from '../../theme/theme';

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 10,
    sortField: 'date',
    sortDir: 'desc',
  });
  const [exportOpen, setExportOpen] = useState(false);
  const alert = useAlert();

  const debouncedSearch = useDebounce(filters.search, 350);

  const loadTransactions = useCallback(
    async (f: TransactionFilters) => {
      setLoading(true);
      alert.clear();
      try {
        const res = await transactionsService.getAll({
          ...f,
          search: debouncedSearch,
        });
        setTransactions(res.data);
        setPagination(res.pagination);
      } catch (err) {
        const e = err as AxiosError<{ error?: { message?: string } }>;
        alert.show(
          e.response?.data?.error?.message ?? 'Failed to load transactions.',
          'error'
        );
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch]
  );

  useEffect(() => {
    loadTransactions({ ...filters, search: debouncedSearch });
  }, [filters, debouncedSearch]);

  const handleFiltersChange = (updates: Partial<TransactionFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  return (
    <Box>
      {/* Alert */}
      {alert.message && (
        <AlertChip
          message={alert.message}
          severity={alert.severity}
          onClose={alert.clear}
          inline
        />
      )}

      {/* Transactions panel */}
      <Box
        sx={{
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          p: 2.5,
        }}
      >
        {/* Panel header */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Transactions
          </Typography>
          {pagination && (
            <Typography variant="caption" color="text.secondary">
              {pagination.total.toLocaleString()} total records
            </Typography>
          )}
        </Box>

        {/* Filters */}
        <Box mb={2}>
          <TransactionFiltersBar
            filters={filters}
            onChange={handleFiltersChange}
            onExportClick={() => setExportOpen(true)}
            totalCount={pagination?.total}
          />
        </Box>

        {/* Table */}
        <TransactionsTable
          transactions={transactions}
          pagination={pagination}
          filters={filters}
          loading={loading}
          onFiltersChange={handleFiltersChange}
        />
      </Box>

      {/* Export Modal */}
      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        filters={filters}
      />
    </Box>
  );
};

export default TransactionsPage;
