import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertChip, useAlert } from '../../components/common/AlertChip';
import { COLORS } from '../../theme/theme';
import { AxiosError } from 'axios';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const alert = useAlert();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert.clear();

    if (!email.trim()) {
      alert.show('Please enter your email address.');
      return;
    }
    if (!password) {
      alert.show('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const axiosErr = err as AxiosError<{ error?: { message?: string } }>;
      const msg =
        axiosErr.response?.data?.error?.message ??
        axiosErr.message ??
        'Login failed. Please check your credentials.';
      alert.show(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: COLORS.bgDeep,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, justifyContent: 'center' }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              backgroundColor: COLORS.green,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: '#000', fontWeight: 800, fontSize: '1.3rem' }}>
              P
            </Typography>
          </Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: COLORS.textPrimary, letterSpacing: '-0.02em' }}
          >
            Penta
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} mb={0.75}>
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Sign in to your financial dashboard
            </Typography>

            {/* Alert chip */}
            {alert.message && (
              <AlertChip
                message={alert.message}
                severity={alert.severity}
                onClose={alert.clear}
                inline
              />
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailRoundedIcon sx={{ color: COLORS.textMuted, fontSize: '1.1rem' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRoundedIcon sx={{ color: COLORS.textMuted, fontSize: '1.1rem' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        size="small"
                        sx={{ color: COLORS.textMuted }}
                      >
                        {showPassword ? (
                          <VisibilityOffRoundedIcon fontSize="small" />
                        ) : (
                          <VisibilityRoundedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                sx={{ py: 1.25, fontSize: '0.9375rem' }}
              >
                {isSubmitting ? (
                  <CircularProgress size={20} sx={{ color: '#000' }} />
                ) : (
                  'Sign In'
                )}
              </Button>
            </Box>

            {/* Demo credentials hint */}
            <Box
              sx={{
                mt: 3,
                p: 1.5,
                backgroundColor: COLORS.bgSurface,
                borderRadius: '8px',
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                Demo credentials:
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Email: <strong style={{ color: COLORS.textPrimary }}>admin@penta.com</strong>
              </Typography>
              <br />
              <Typography variant="caption" color="text.secondary">
                Password: <strong style={{ color: COLORS.textPrimary }}>password123</strong>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default LoginPage;
