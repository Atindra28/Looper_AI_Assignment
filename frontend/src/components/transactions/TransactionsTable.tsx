import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Typography,
  Skeleton,
  TableSortLabel,
} from '@mui/material';
import { Transaction, PaginationMeta, TransactionFilters } from '../../types';
import StatusBadge from '../common/StatusBadge';
import AmountDisplay from '../common/AmountDisplay';
import EmptyState from '../common/EmptyState';
import { formatDate } from '../../utils/formatDate';
import { COLORS } from '../../theme/theme';

interface Column {
  id: string;
  label: string;
  sortable: boolean;
  align?: 'left' | 'right' | 'center';
}

const COLUMNS: Column[] = [
  { id: 'userName', label: 'Name', sortable: true },
  { id: 'date', label: 'Date', sortable: true },
  { id: 'amount', label: 'Amount', sortable: true, align: 'right' },
  { id: 'category', label: 'Category', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
];

const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

interface TransactionsTableProps {
  transactions: Transaction[];
  pagination: PaginationMeta | null;
  filters: TransactionFilters;
  loading: boolean;
  onFiltersChange: (updates: Partial<TransactionFilters>) => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  pagination,
  filters,
  loading,
  onFiltersChange,
}) => {
  const handleSort = (field: string) => {
    const isActive = filters.sortField === field;
    const currentDir = filters.sortDir ?? 'desc';
    const newDir = isActive && currentDir === 'desc' ? 'asc' : 'desc';
    onFiltersChange({ sortField: field, sortDir: newDir, page: 1 });
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    onFiltersChange({ page: newPage + 1 }); // MUI is 0-based, API is 1-based
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ limit: parseInt(e.target.value, 10), page: 1 });
  };

  const sortDir = (field: string): 'asc' | 'desc' =>
    filters.sortField === field ? (filters.sortDir ?? 'desc') : 'desc';

  const isActive = (field: string) => filters.sortField === field;

  return (
    <Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {COLUMNS.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align ?? 'left'}
                  sortDirection={isActive(col.id) ? sortDir(col.id) : false}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={isActive(col.id)}
                      direction={sortDir(col.id)}
                      onClick={() => handleSort(col.id)}
                      sx={{
                        color: isActive(col.id)
                          ? `${COLORS.green} !important`
                          : COLORS.textSecondary,
                        '& .MuiTableSortLabel-icon': {
                          color: `${COLORS.green} !important`,
                        },
                        '&:hover': { color: COLORS.textPrimary },
                      }}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              Array.from({ length: filters.limit ?? 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Skeleton variant="circular" width={36} height={36} />
                      <Skeleton variant="text" width={120} />
                    </Box>
                  </TableCell>
                  <TableCell><Skeleton variant="text" width={140} /></TableCell>
                  <TableCell align="right"><Skeleton variant="text" width={80} /></TableCell>
                  <TableCell><Skeleton variant="text" width={80} /></TableCell>
                  <TableCell><Skeleton variant="rounded" width={70} height={24} /></TableCell>
                </TableRow>
              ))
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ border: 'none' }}>
                  <EmptyState
                    title="No transactions found"
                    message="Try adjusting your filters or search query."
                  />
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow
                  key={tx._id}
                  sx={{ '&:last-child td': { borderBottom: 0 } }}
                >
                  {/* Name */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        alt={tx.userName}
                        sx={{
                          width: 36,
                          height: 36,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: COLORS.bgElevated,
                          color: COLORS.green,
                          border: `1px solid ${COLORS.border}`,
                          flexShrink: 0,
                        }}
                      >
                        {getInitials(tx.userName)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {tx.userName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tx.user_id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Date */}
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(tx.date)}
                    </Typography>
                  </TableCell>

                  {/* Amount */}
                  <TableCell align="right">
                    <AmountDisplay
                      amount={tx.amount}
                      category={tx.category}
                      variant="body2"
                    />
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          tx.category === 'Revenue' ? COLORS.green : COLORS.red,
                        fontWeight: 500,
                      }}
                    >
                      {tx.category}
                    </Typography>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <StatusBadge status={tx.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.total}
          page={(filters.page ?? 1) - 1} // Convert 1-based to 0-based for MUI
          rowsPerPage={filters.limit ?? 10}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            '.MuiTablePagination-toolbar': { px: 2 },
          }}
        />
      )}
    </Box>
  );
};

export default TransactionsTable;
