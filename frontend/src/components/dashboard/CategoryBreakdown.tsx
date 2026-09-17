import React from 'react';
import { Box, Card, CardContent, Typography, Skeleton, LinearProgress } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CategoryDataPoint } from '../../types';
import { COLORS } from '../../theme/theme';
import { formatCompact } from '../../utils/formatCurrency';

interface CategoryBreakdownProps {
  data: CategoryDataPoint[];
  loading?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  Revenue: COLORS.green,
  Expense: COLORS.red,
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: CategoryDataPoint }>;
}

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <Box
      sx={{
        backgroundColor: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '10px',
        p: 1.5,
      }}
    >
      <Typography variant="body2" fontWeight={600} color="text.primary">
        {item.category}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {formatCompact(item.total)} ({item.percentage}%)
      </Typography>
    </Box>
  );
};

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ data, loading }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Typography variant="subtitle1" fontWeight={700} color="text.primary" mb={2}>
          Category Breakdown
        </Typography>

        {loading ? (
          <>
            <Skeleton variant="circular" width={160} height={160} sx={{ mx: 'auto', mb: 2 }} />
            <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={24} />
          </>
        ) : data.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
            No data available
          </Typography>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="total"
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.category}
                      fill={CATEGORY_COLORS[entry.category] ?? COLORS.textMuted}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Category list */}
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {data.map((item) => (
                <Box key={item.category}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 0.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor:
                            CATEGORY_COLORS[item.category] ?? COLORS.textMuted,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {item.category}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={600} color="text.primary">
                      {item.percentage}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.percentage}
                    sx={{
                      height: 5,
                      borderRadius: 3,
                      backgroundColor: COLORS.bgElevated,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor:
                          CATEGORY_COLORS[item.category] ?? COLORS.green,
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryBreakdown;
