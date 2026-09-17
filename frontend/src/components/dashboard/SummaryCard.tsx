import React from 'react';
import { Box, Card, CardContent, Typography, Skeleton } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import { formatCompact } from '../../utils/formatCurrency';
import { COLORS } from '../../theme/theme';

export type CardType = 'balance' | 'revenue' | 'expenses' | 'savings';

interface SummaryCardProps {
  type: CardType;
  value: number;
  change: number;
  loading?: boolean;
}

const CARD_CONFIG: Record<
  CardType,
  {
    label: string;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
  }
> = {
  balance: {
    label: 'Balance',
    icon: <AccountBalanceWalletRoundedIcon />,
    iconBg: COLORS.greenBg,
    iconColor: COLORS.green,
  },
  revenue: {
    label: 'Revenue',
    icon: <TrendingUpRoundedIcon />,
    iconBg: COLORS.greenBg,
    iconColor: COLORS.green,
  },
  expenses: {
    label: 'Expenses',
    icon: <TrendingDownRoundedIcon />,
    iconBg: COLORS.redBg,
    iconColor: COLORS.red,
  },
  savings: {
    label: 'Savings',
    icon: <SavingsRoundedIcon />,
    iconBg: COLORS.yellowBg,
    iconColor: COLORS.yellow,
  },
};

const SummaryCard: React.FC<SummaryCardProps> = ({
  type,
  value,
  change,
  loading = false,
}) => {
  const config = CARD_CONFIG[type];
  const isPositiveChange = change >= 0;
  const changeColor = isPositiveChange ? COLORS.green : COLORS.red;

  return (
    <Card
      sx={{
        flex: 1,
        minWidth: 0,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box
          sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              backgroundColor: config.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: config.iconColor,
              '& svg': { fontSize: '1.4rem' },
            }}
          >
            {config.icon}
          </Box>
        </Box>

        {/* Label */}
        <Typography
          variant="caption"
          sx={{ color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}
        >
          {config.label}
        </Typography>

        {/* Value */}
        {loading ? (
          <Skeleton variant="text" width={120} height={40} sx={{ my: 0.5 }} />
        ) : (
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: COLORS.textPrimary,
              my: 0.5,
              fontSize: { xs: '1.3rem', xl: '1.5rem' },
              letterSpacing: '-0.02em',
            }}
          >
            {formatCompact(value)}
          </Typography>
        )}

        {/* Change indicator */}
        {loading ? (
          <Skeleton variant="text" width={80} height={20} />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isPositiveChange ? (
              <TrendingUpIcon sx={{ fontSize: '0.9rem', color: changeColor }} />
            ) : (
              <TrendingDownIcon sx={{ fontSize: '0.9rem', color: changeColor }} />
            )}
            <Typography
              variant="caption"
              sx={{ color: changeColor, fontWeight: 600 }}
            >
              {isPositiveChange ? '+' : ''}{change}% this month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
