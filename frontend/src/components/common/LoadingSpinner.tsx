import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { COLORS } from '../../theme/theme';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  fullHeight?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  size = 40,
  fullHeight = false,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      sx={{ minHeight: fullHeight ? '60vh' : 120 }}
    >
      <CircularProgress
        size={size}
        thickness={4}
        sx={{ color: COLORS.green }}
      />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;
