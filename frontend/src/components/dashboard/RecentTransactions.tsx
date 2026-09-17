import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Skeleton,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Transaction } from '../../types';
import AmountDisplay from '../common/AmountDisplay';
import { formatDateShort } from '../../utils/formatDate';
import { COLORS } from '../../theme/theme';

interface RecentTransactionsProps {
  transactions: Transaction[];
  loading?: boolean;
}

const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  loading = false,
}) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
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
            Recent Transaction
          </Typography>
          <Button
            variant="text"
            size="small"
            onClick={() => navigate('/transactions')}
            sx={{
              color: COLORS.green,
              fontSize: '0.75rem',
              fontWeight: 600,
              p: 0,
              minWidth: 'auto',
              '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
            }}
          >
            See all
          </Button>
        </Box>

        {/* Transaction list */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Box
                  key={i}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                >
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" height={18} />
                    <Skeleton variant="text" width="40%" height={14} />
                  </Box>
                  <Skeleton variant="text" width={70} height={18} />
                </Box>
              ))
            : transactions.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  py={3}
                >
                  No recent transactions
                </Typography>
              ) : (
                transactions.map((tx) => (
                  <Box
                    key={tx._id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      py: 0.5,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: COLORS.bgHover },
                      px: 1,
                      mx: -1,
                      transition: 'background-color 0.15s',
                    }}
                    onClick={() => navigate('/transactions')}
                  >
                    <Avatar
                      alt={tx.userName}
                      sx={{
                        width: 38,
                        height: 38,
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        backgroundColor: COLORS.bgElevated,
                        color: COLORS.green,
                        border: `1px solid ${COLORS.border}`,
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(tx.userName)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="text.primary"
                        noWrap
                      >
                        {tx.userName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {formatDateShort(tx.date)}
                      </Typography>
                    </Box>
                    <AmountDisplay
                      amount={tx.amount}
                      category={tx.category}
                      variant="body2"
                      fontWeight={600}
                    />
                  </Box>
                ))
              )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
