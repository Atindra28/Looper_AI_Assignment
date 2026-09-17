import React from 'react';
import {
  Box,
  InputBase,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Tooltip,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import { TransactionFilters } from '../../types';
import { COLORS } from '../../theme/theme';

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onChange: (updates: Partial<TransactionFilters>) => void;
  onExportClick: () => void;
  totalCount?: number;
}

const TransactionFiltersBar: React.FC<TransactionFiltersProps> = ({
  filters,
  onChange,
  onExportClick,
  totalCount,
}) => {
  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.status ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.amountMin !== undefined ||
    filters.amountMax !== undefined;

  const handleClear = () => {
    onChange({
      search: '',
      category: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      amountMin: undefined,
      amountMax: undefined,
      page: 1,
    });
  };

  return (
    <Box>
      {/* Row 1: Search + Export */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: 1.5,
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <Box
          sx={{
            flex: 1,
            minWidth: 200,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: COLORS.bgSurface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '10px',
            px: 1.5,
            py: 0.75,
            gap: 1,
            '&:focus-within': { borderColor: COLORS.green },
          }}
        >
          <SearchRoundedIcon sx={{ color: COLORS.textMuted, fontSize: '1.1rem' }} />
          <InputBase
            placeholder="Search transactions..."
            value={filters.search ?? ''}
            onChange={(e) => onChange({ search: e.target.value, page: 1 })}
            sx={{
              flex: 1,
              fontSize: '0.875rem',
              color: COLORS.textPrimary,
              '& input::placeholder': { color: COLORS.textMuted },
            }}
          />
        </Box>

        {/* Clear filters */}
        {hasActiveFilters && (
          <Tooltip title="Clear all filters">
            <Button
              variant="outlined"
              size="small"
              startIcon={<ClearRoundedIcon />}
              onClick={handleClear}
              sx={{ height: 38, whiteSpace: 'nowrap' }}
            >
              Clear
            </Button>
          </Tooltip>
        )}

        {/* Export button */}
        <Button
          variant="contained"
          size="small"
          startIcon={<FileDownloadRoundedIcon />}
          onClick={onExportClick}
          sx={{ height: 38, whiteSpace: 'nowrap' }}
        >
          Export CSV
        </Button>
      </Box>

      {/* Row 2: Filters */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexWrap: 'wrap',
        }}
      >
        <FilterListRoundedIcon sx={{ color: COLORS.textMuted, fontSize: '1rem' }} />
        <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
          Filters:
        </Typography>

        {/* Category */}
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select
            value={filters.category ?? ''}
            onChange={(e) => onChange({ category: e.target.value as TransactionFilters['category'], page: 1 })}
            displayEmpty
            sx={{
              fontSize: '0.8125rem',
              height: 34,
              '.MuiOutlinedInput-notchedOutline': { borderColor: COLORS.border },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.borderLight },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.green },
            }}
          >
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="Revenue">Revenue</MenuItem>
            <MenuItem value="Expense">Expense</MenuItem>
          </Select>
        </FormControl>

        {/* Status */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={filters.status ?? ''}
            onChange={(e) => onChange({ status: e.target.value as TransactionFilters['status'], page: 1 })}
            displayEmpty
            sx={{
              fontSize: '0.8125rem',
              height: 34,
              '.MuiOutlinedInput-notchedOutline': { borderColor: COLORS.border },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.borderLight },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.green },
            }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </Select>
        </FormControl>

        {/* Date From */}
        <TextField
          type="date"
          size="small"
          label="From"
          value={filters.dateFrom ?? ''}
          onChange={(e) => onChange({ dateFrom: e.target.value, page: 1 })}
          InputLabelProps={{ shrink: true }}
          inputProps={{ style: { fontSize: '0.8125rem' } }}
          sx={{
            width: 150,
            '& .MuiInputBase-root': { height: 34 },
          }}
        />

        {/* Date To */}
        <TextField
          type="date"
          size="small"
          label="To"
          value={filters.dateTo ?? ''}
          onChange={(e) => onChange({ dateTo: e.target.value, page: 1 })}
          InputLabelProps={{ shrink: true }}
          inputProps={{ style: { fontSize: '0.8125rem' } }}
          sx={{
            width: 150,
            '& .MuiInputBase-root': { height: 34 },
          }}
        />

        {/* User ID */}
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select
            value={filters.user_id ?? ''}
            onChange={(e) => onChange({ user_id: e.target.value, page: 1 })}
            displayEmpty
            sx={{
              fontSize: '0.8125rem',
              height: 34,
              '.MuiOutlinedInput-notchedOutline': { borderColor: COLORS.border },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.borderLight },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.green },
            }}
          >
            <MenuItem value="">All Users</MenuItem>
            <MenuItem value="user_001">Alex Morgan</MenuItem>
            <MenuItem value="user_002">Jamie Chen</MenuItem>
            <MenuItem value="user_003">Riley Johnson</MenuItem>
            <MenuItem value="user_004">Sam Williams</MenuItem>
          </Select>
        </FormControl>

        {/* Amount Min */}
        <TextField
          type="number"
          size="small"
          label="Min $"
          value={filters.amountMin ?? ''}
          onChange={(e) => {
            const val = e.target.value;
            onChange({ amountMin: val === '' ? undefined : parseFloat(val), page: 1 });
          }}
          inputProps={{ min: 0, step: 0.01, style: { fontSize: '0.8125rem' } }}
          sx={{ width: 100, '& .MuiInputBase-root': { height: 34 } }}
        />

        {/* Amount Max */}
        <TextField
          type="number"
          size="small"
          label="Max $"
          value={filters.amountMax ?? ''}
          onChange={(e) => {
            const val = e.target.value;
            onChange({ amountMax: val === '' ? undefined : parseFloat(val), page: 1 });
          }}
          inputProps={{ min: 0, step: 0.01, style: { fontSize: '0.8125rem' } }}
          sx={{ width: 100, '& .MuiInputBase-root': { height: 34 } }}
        />

        {totalCount !== undefined && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
            {totalCount.toLocaleString()} result{totalCount !== 1 ? 's' : ''}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TransactionFiltersBar;
