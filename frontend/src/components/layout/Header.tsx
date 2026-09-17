import React, { useState } from 'react';
import {
  Box,
  Typography,
  InputBase,
  IconButton,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/SearchRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../theme/theme';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transactions',
  '/wallet': 'Wallet',
  '/analytics': 'Analytics',
  '/personal': 'Personal',
  '/message': 'Message',
  '/setting': 'Setting',
};

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Dashboard';
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'AD';

  const handleAvatarClick = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, sm: 3 },
        py: 2,
        borderBottom: `1px solid ${COLORS.border}`,
        backgroundColor: COLORS.bgDeep,
        gap: 2,
      }}
    >
      {/* Left: Hamburger (mobile) + Page Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconButton
          onClick={onMenuClick}
          sx={{
            display: { md: 'none' },
            color: COLORS.textSecondary,
          }}
        >
          <MenuRoundedIcon />
        </IconButton>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.15rem', sm: '1.35rem' },
            color: COLORS.textPrimary,
            letterSpacing: '-0.02em',
          }}
        >
          {pageTitle}
        </Typography>
      </Box>

      {/* Right: Search + Notification + Avatar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {/* Search */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            backgroundColor: COLORS.bgSurface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '10px',
            px: 1.5,
            py: 0.75,
            gap: 1,
            minWidth: 220,
            '&:focus-within': {
              borderColor: COLORS.green,
            },
          }}
        >
          <InputBase
            placeholder="Search..."
            sx={{
              flex: 1,
              fontSize: '0.875rem',
              color: COLORS.textPrimary,
              '& input::placeholder': { color: COLORS.textMuted },
            }}
          />
          <SearchIcon sx={{ color: COLORS.textMuted, fontSize: '1.1rem' }} />
        </Box>

        {/* Notification bell */}
        <Tooltip title="Notifications">
          <IconButton
            sx={{
              color: COLORS.textSecondary,
              backgroundColor: COLORS.bgSurface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '10px',
              width: 38,
              height: 38,
              '&:hover': { borderColor: COLORS.green, color: COLORS.green },
            }}
          >
            <Badge
              badgeContent={3}
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: COLORS.green,
                  color: '#000',
                  fontSize: '0.6rem',
                  minWidth: 16,
                  height: 16,
                },
              }}
            >
              <NotificationsNoneRoundedIcon sx={{ fontSize: '1.2rem' }} />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Avatar */}
        <Tooltip title={user?.name ?? 'Account'}>
          <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
            <Avatar
              src={user?.avatarUrl}
              alt={user?.name}
              sx={{
                width: 38,
                height: 38,
                border: `2px solid ${COLORS.green}`,
                fontSize: '0.875rem',
                fontWeight: 700,
                backgroundColor: COLORS.bgElevated,
                color: COLORS.green,
                cursor: 'pointer',
              }}
            >
              {userInitials}
            </Avatar>
          </IconButton>
        </Tooltip>

        {/* User dropdown menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 180,
              backgroundColor: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" fontWeight={600} color="text.primary">
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={handleMenuClose} sx={{ gap: 1.5, fontSize: '0.875rem' }}>
            <PersonRoundedIcon fontSize="small" />
            Profile
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            sx={{ gap: 1.5, fontSize: '0.875rem', color: COLORS.red }}
          >
            <LogoutRoundedIcon fontSize="small" />
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Header;
