import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar, { SIDEBAR_WIDTH } from './Sidebar';
import Header from './Header';
import { COLORS } from '../../theme/theme';

const AppLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: COLORS.bgDeep,
      }}
    >
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content area — offset by sidebar width on desktop */}
      <Box
        component="main"
        sx={{
          flex: 1,
          ml: { md: `${SIDEBAR_WIDTH}px` },
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Header onMenuClick={() => setMobileOpen(true)} />

        {/* Page content */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3 },
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
