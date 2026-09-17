import React from 'react';
import { Box, Typography } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { COLORS } from '../../theme/theme';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data found',
  message = 'There are no records matching your current filters.',
  icon,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={1.5}
      sx={{ minHeight: 160, py: 4 }}
    >
      {icon ?? (
        <InboxOutlinedIcon
          sx={{ fontSize: 48, color: COLORS.textMuted, mb: 0.5 }}
        />
      )}
      <Typography variant="subtitle1" color="text.primary" fontWeight={600}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        sx={{ maxWidth: 320 }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default EmptyState;
