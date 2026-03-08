import React from 'react';
import { Box, AppBar, Toolbar, Typography, Container } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderBottom: '1px solid #333',
        }}
      >
        <Toolbar>
          <TrendingUpIcon sx={{ color: '#90caf9', mr: 2, fontSize: 32 }} />
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              background: 'linear-gradient(90deg, #90caf9, #ce93d8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Stock Predictor
          </Typography>
          <Typography variant="caption" sx={{ color: '#666' }}>
            LSTM Neural Network
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
};