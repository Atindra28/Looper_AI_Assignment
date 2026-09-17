import React from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Drawer,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/GridViewRounded';
import TransactionIcon from '@mui/icons-material/ReceiptLongRounded';
import WalletIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import AnalyticsIcon from '@mui/icons-material/BarChartRounded';
import PersonIcon from '@mui/icons-material/PersonRounded';
import MessageIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import SettingsIcon from '@mui/icons-material/SettingsRounded';
import { COLORS } from '../../theme/theme';

export const SIDEBAR_WIDTH = 240;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  implemented: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon />, implemented: true },
  { label: 'Transactions', path: '/transactions', icon: <TransactionIcon />, implemented: true },
  { label: 'Wallet', path: '/wallet', icon: <WalletIcon />, implemented: false },
  { label: 'Analytics', path: '/analytics', icon: <AnalyticsIcon />, implemented: false },
  { label: 'Personal', path: '/personal', icon: <PersonIcon />, implemented: false },
  { label: 'Message', path: '/message', icon: <MessageIcon />, implemented: false },
  { label: 'Setting', path: '/setting', icon: <SettingsIcon />, implemented: false },
];

interface SidebarContentProps {
  onNavClick?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ onNavClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) =>
    location.pathname === path ||
    (path !== '/dashboard' && location.pathname.startsWith(path));

  const handleNav = (path: string) => {
    navigate(path);
    onNavClick?.();
  };

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: '100%',
        backgroundColor: COLORS.bgSurface,
        borderRight: `1px solid ${COLORS.border}`,
        display: 'flex',
        flexDirection: 'column',
        py: 2,
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 3,
          py: 2,
          mb: 1,
        }}
      >
        {/* Penta logo mark */}
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            backgroundColor: COLORS.green,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{
              color: '#000',
              fontWeight: 800,
              fontSize: '1.1rem',
              lineHeight: 1,
              fontFamily: '"Inter", sans-serif',
            }}
          >
            P
          </Typography>
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: '1.2rem',
            color: COLORS.textPrimary,
            letterSpacing: '-0.02em',
          }}
        >
          Penta
        </Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItemButton
              key={item.path}
              selected={active}
              onClick={() => handleNav(item.path)}
              sx={{
                borderRadius: '10px',
                mb: 0.5,
                position: 'relative',
                py: 1.2,
                px: 1.5,
                // Active left bar indicator
                '&.Mui-selected::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '20%',
                  height: '60%',
                  width: 3,
                  backgroundColor: COLORS.green,
                  borderRadius: '0 3px 3px 0',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 38,
                  color: active ? COLORS.green : COLORS.textSecondary,
                  '& svg': { fontSize: '1.25rem' },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: active ? 600 : 400,
                  color: active ? COLORS.textPrimary : COLORS.textSecondary,
                }}
              />
              {!item.implemented && (
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: COLORS.textMuted,
                    opacity: 0.5,
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
};

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            backgroundColor: COLORS.bgSurface,
            border: 'none',
          },
        }}
      >
        <SidebarContent onNavClick={onMobileClose} />
      </Drawer>
    );
  }

  return (
    <Box
      component="nav"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      <SidebarContent />
    </Box>
  );
};

export default Sidebar;
