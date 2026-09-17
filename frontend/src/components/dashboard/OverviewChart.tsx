import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  Skeleton,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { TrendDataPoint } from '../../types';
import { COLORS } from '../../theme/theme';

interface OverviewChartProps {
  data: TrendDataPoint[];
  loading?: boolean;
  availableYears?: number[];
  selectedYear?: number;
  onYearChange?: (year: number) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <Box
      sx={{
        backgroundColor: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '10px',
        p: 1.5,
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        {label}
      </Typography>
      {payload.map((entry) => (
        <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: entry.color,
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            {entry.name}:
          </Typography>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            ${entry.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const OverviewChart: React.FC<OverviewChartProps> = ({
  data,
  loading = false,
  availableYears = [2024],
  selectedYear = 2024,
  onYearChange,
}) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, height: '100%' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            Overview
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Legend */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box
                  sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: COLORS.chartRevenue }}
                />
                <Typography variant="caption" color="text.secondary">
                  Income
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box
                  sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: COLORS.chartExpense }}
                />
                <Typography variant="caption" color="text.secondary">
                  Expense
                </Typography>
              </Box>
            </Box>
            {/* Year selector */}
            <Select
              value={selectedYear}
              onChange={(e) => onYearChange?.(Number(e.target.value))}
              size="small"
              sx={{
                fontSize: '0.75rem',
                height: 30,
                '.MuiOutlinedInput-notchedOutline': { borderColor: COLORS.border },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.borderLight },
                '.MuiSelect-select': { py: 0.5, px: 1 },
              }}
            >
              {availableYears.map((y) => (
                <MenuItem key={y} value={y} sx={{ fontSize: '0.75rem' }}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {/* Chart */}
        {loading ? (
          <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.chartRevenue} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={COLORS.chartRevenue} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.chartExpense} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={COLORS.chartExpense} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={COLORS.border}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: COLORS.textMuted, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: COLORS.textMuted, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Income"
                stroke={COLORS.chartRevenue}
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                dot={false}
                activeDot={{ r: 5, fill: COLORS.chartRevenue }}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                name="Expense"
                stroke={COLORS.chartExpense}
                strokeWidth={2.5}
                fill="url(#expenseGradient)"
                dot={false}
                activeDot={{ r: 5, fill: COLORS.chartExpense }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default OverviewChart;
