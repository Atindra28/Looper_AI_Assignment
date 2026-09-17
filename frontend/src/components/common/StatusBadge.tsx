import React from 'react';
import { Chip } from '@mui/material';
import { TransactionStatus } from '../../types';
import { COLORS } from '../../theme/theme';

interface StatusBadgeProps {
  status: TransactionStatus;
  size?: 'small' | 'medium';
}

const STATUS_STYLES: Record<
  TransactionStatus,
  { bg: string; color: string; border: string; label: string }
> = {
  Paid: {
    bg: COLORS.greenBg,
    color: COLORS.green,
    border: `1px solid rgba(0,196,140,0.3)`,
    label: 'Paid',
  },
  Pending: {
    bg: COLORS.yellowBg,
    color: COLORS.yellow,
    border: `1px solid rgba(245,184,0,0.3)`,
    label: 'Pending',
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'small' }) => {
  const styles = STATUS_STYLES[status] ?? STATUS_STYLES.Pending;

  return (
    <Chip
      label={styles.label}
      size={size}
      sx={{
        backgroundColor: styles.bg,
        color: styles.color,
        border: styles.border,
        fontWeight: 600,
        fontSize: size === 'small' ? '0.7rem' : '0.75rem',
        height: size === 'small' ? 24 : 28,
        borderRadius: '20px',
        '& .MuiChip-label': { px: 1.5 },
      }}
    />
  );
};

export default StatusBadge;
