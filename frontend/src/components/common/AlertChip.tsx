import React, { useState } from 'react';
import { Alert, Collapse, IconButton, Snackbar, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export type AlertSeverity = 'error' | 'warning' | 'info' | 'success';

interface AlertChipProps {
  message: string;
  severity?: AlertSeverity;
  onClose?: () => void;
  inline?: boolean; // true = inline alert, false = floating snackbar chip
}

const ICON_MAP = {
  error: <ErrorOutlineIcon fontSize="small" />,
  warning: <WarningAmberIcon fontSize="small" />,
  info: <InfoOutlinedIcon fontSize="small" />,
  success: <CheckCircleOutlineIcon fontSize="small" />,
};

const COLOR_MAP = {
  error: { bg: 'rgba(255,91,91,0.12)', border: '#FF5B5B', text: '#FF5B5B' },
  warning: { bg: 'rgba(245,184,0,0.12)', border: '#F5B800', text: '#F5B800' },
  info: { bg: 'rgba(66,165,245,0.12)', border: '#42A5F5', text: '#42A5F5' },
  success: { bg: 'rgba(0,196,140,0.12)', border: '#00C48C', text: '#00C48C' },
};

/**
 * Reusable alert chip / notification component.
 * inline=true renders a styled chip inline in the page.
 * inline=false (default) renders as a floating Snackbar.
 */
export const AlertChip: React.FC<AlertChipProps> = ({
  message,
  severity = 'error',
  onClose,
  inline = false,
}) => {
  const [visible, setVisible] = useState(true);
  const colors = COLOR_MAP[severity];

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  if (!message || !visible) return null;

  if (inline) {
    return (
      <Collapse in={visible}>
        <Alert
          severity={severity}
          onClose={handleClose}
          icon={ICON_MAP[severity]}
          sx={{
            backgroundColor: colors.bg,
            border: `1px solid ${colors.border}`,
            color: colors.text,
            borderRadius: '10px',
            mb: 2,
            '& .MuiAlert-icon': { color: colors.text },
            '& .MuiIconButton-root': { color: colors.text },
          }}
        >
          {message}
        </Alert>
      </Collapse>
    );
  }

  // Floating chip style (snackbar)
  return (
    <Snackbar
      open={visible}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Chip
        icon={ICON_MAP[severity]}
        label={message}
        onDelete={handleClose}
        deleteIcon={<CloseIcon fontSize="small" />}
        sx={{
          backgroundColor: colors.bg,
          border: `1px solid ${colors.border}`,
          color: colors.text,
          fontWeight: 500,
          fontSize: '0.8125rem',
          padding: '8px 4px',
          height: 'auto',
          maxWidth: 480,
          '& .MuiChip-icon': { color: colors.text },
          '& .MuiChip-deleteIcon': {
            color: colors.text,
            '&:hover': { color: colors.text, opacity: 0.7 },
          },
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
      />
    </Snackbar>
  );
};

/**
 * Hook-like component: manages an alert message state.
 * Use AlertMessage.show() and AlertMessage.clear() in parent components.
 */
interface UseAlertReturn {
  message: string;
  severity: AlertSeverity;
  show: (msg: string, sev?: AlertSeverity) => void;
  clear: () => void;
}

export const useAlert = (): UseAlertReturn => {
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertSeverity>('error');

  return {
    message,
    severity,
    show: (msg: string, sev: AlertSeverity = 'error') => {
      setMessage(msg);
      setSeverity(sev);
    },
    clear: () => setMessage(''),
  };
};

export default AlertChip;
