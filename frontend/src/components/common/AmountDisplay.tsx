import React from 'react';
import { Typography } from '@mui/material';
import { TransactionCategory } from '../../types';
import { COLORS } from '../../theme/theme';

interface AmountDisplayProps {
  amount: number;
  category: TransactionCategory;
  variant?: 'body1' | 'body2' | 'subtitle1' | 'subtitle2' | 'h6';
  fontWeight?: number;
}

const AmountDisplay: React.FC<AmountDisplayProps> = ({
  amount,
  category,
  variant = 'body1',
  fontWeight = 600,
}) => {
  const isRevenue = category === 'Revenue';
  const color = isRevenue ? COLORS.green : COLORS.red;
  const sign = isRevenue ? '+' : '-';
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);

  return (
    <Typography
      variant={variant}
      component="span"
      sx={{ color, fontWeight }}
    >
      {sign}{formatted}
    </Typography>
  );
};

export default AmountDisplay;
