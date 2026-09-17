import React, { useEffect, useState, useCallback } from 'react';
import { Box, Grid } from '@mui/material';
import { AxiosError } from 'axios';
import { SummaryData, TrendDataPoint, CategoryDataPoint, Transaction } from '../../types';
import { dashboardService } from '../../services/dashboard.service';
import SummaryCard from '../../components/dashboard/SummaryCard';
import OverviewChart from '../../components/dashboard/OverviewChart';
import CategoryBreakdown from '../../components/dashboard/CategoryBreakdown';
import RecentTransactions from '../../components/dashboard/RecentTransactions';
import TransactionsTable from '../../components/transactions/TransactionsTable';
import TransactionFiltersBar from '../../components/transactions/TransactionFilters';
import { AlertChip, useAlert } from '../../components/common/AlertChip';
import { transactionsService } from '../../services/transactions.service';
import { useDebounce } from '../../hooks/useDebounce';
import { TransactionFilters, PaginationMeta } from '../../types';
import ExportModal from '../../components/export/ExportModal';

const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [trends, setTrends] = useState<TrendDataPoint[]>([]);
  const [categories, setCategories] = useState<CategoryDataPoint[]>([]);
  const [recentTx, setRecentTx] = useState<Transaction[]>([]);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2024);
  const dashAlert = useAlert();

  // Transactions table state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [txLoading, setTxLoading] = useState(true);
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 10,
    sortField: 'date',
    sortDir: 'desc',
  });
  const txAlert = useAlert();
  const [exportOpen, setExportOpen] = useState(false);

  const debouncedSearch = useDebounce(filters.search, 350);

  // Load dashboard data
  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const data = await dashboardService.getSummary();
      setSummary(data);
    } catch (err) {
      const e = err as AxiosError<{ error?: { message?: string } }>;
      dashAlert.show(
        e.response?.data?.error?.message ?? 'Failed to load dashboard summary.',
        'error'
      );
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const loadTrends = useCallback(async (year: number) => {
    setChartLoading(true);
    try {
      const [trendData, catData] = await Promise.all([
        dashboardService.getTrends(year),
        dashboardService.getCategories(),
      ]);
      setTrends(trendData);
      setCategories(catData);
    } catch (err) {
      const e = err as AxiosError<{ error?: { message?: string } }>;
      dashAlert.show(
        e.response?.data?.error?.message ?? 'Failed to load chart data.',
        'error'
      );
    } finally {
      setChartLoading(false);
    }
  }, []);

  const loadRecent = useCallback(async () => {
    setRecentLoading(true);
    try {
      const data = await dashboardService.getRecent();
      setRecentTx(data);
    } catch {
      // Non-critical — silent
    } finally {
      setRecentLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
    loadRecent();
  }, [loadSummary, loadRecent]);

  useEffect(() => {
    loadTrends(selectedYear);
  }, [selectedYear, loadTrends]);

  // Load transactions
  const loadTransactions = useCallback(
    async (f: TransactionFilters) => {
      setTxLoading(true);
      txAlert.clear();
      try {
        const res = await transactionsService.getAll({
          ...f,
          search: debouncedSearch,
        });
        setTransactions(res.data);
        setPagination(res.pagination);
      } catch (err) {
        const e = err as AxiosError<{ error?: { message?: string } }>;
        txAlert.show(
          e.response?.data?.error?.message ?? 'Failed to load transactions.',
          'error'
        );
      } finally {
        setTxLoading(false);
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
      {/* Dashboard alerts */}
      {dashAlert.message && (
        <AlertChip
          message={dashAlert.message}
          severity={dashAlert.severity}
          onClose={dashAlert.clear}
          inline
        />
      )}

      {/* Summary cards */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          flexWrap: 'wrap',
        }}
      >
        <SummaryCard
          type="balance"
          value={summary?.balance ?? 0}
          change={summary?.balanceChange ?? 0}
          loading={summaryLoading}
        />
        <SummaryCard
          type="revenue"
          value={summary?.totalRevenue ?? 0}
          change={summary?.revenueChange ?? 0}
          loading={summaryLoading}
        />
        <SummaryCard
          type="expenses"
          value={summary?.totalExpenses ?? 0}
          change={summary?.expensesChange ?? 0}
          loading={summaryLoading}
        />
        <SummaryCard
          type="savings"
          value={summary?.savings ?? 0}
          change={summary?.savingsChange ?? 0}
          loading={summaryLoading}
        />
      </Box>

      {/* Chart row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={8}>
          <OverviewChart
            data={trends}
            loading={chartLoading}
            availableYears={[2024]}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <RecentTransactions
            transactions={recentTx}
            loading={recentLoading}
          />
        </Grid>
      </Grid>

      {/* Category breakdown */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <CategoryBreakdown data={categories} loading={chartLoading} />
        </Grid>
      </Grid>

      {/* Transactions table */}
      <Box
        sx={{
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          p: 2.5,
        }}
      >
        <Box mb={2}>
          <TransactionFiltersBar
            filters={filters}
            onChange={handleFiltersChange}
            onExportClick={() => setExportOpen(true)}
            totalCount={pagination?.total}
          />
        </Box>

        {txAlert.message && (
          <AlertChip
            message={txAlert.message}
            severity={txAlert.severity}
            onClose={txAlert.clear}
            inline
          />
        )}

        <TransactionsTable
          transactions={transactions}
          pagination={pagination}
          filters={filters}
          loading={txLoading}
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

export default DashboardPage;
