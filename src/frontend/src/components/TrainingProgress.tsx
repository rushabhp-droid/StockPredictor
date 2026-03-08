import React from 'react';
import { Box, LinearProgress, Typography, Paper } from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';

interface TrainingProgressProps {
  isTraining: boolean;
  ticker?: string;
  progress?: number;
}

export const TrainingProgress: React.FC<TrainingProgressProps> = ({
  isTraining,
  ticker,
  progress = 0
}) => {
  if (!isTraining) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mt: 2,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        border: '1px solid #333',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <MemoryIcon sx={{ color: '#90caf9', mr: 1, animation: 'pulse 1s infinite' }} />
        <Typography variant="h6" sx={{ color: '#90caf9' }}>
          Training LSTM Model for {ticker}
        </Typography>
      </Box>

      <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 1 }}>
        This may take several minutes. The model is learning patterns from historical data...
      </Typography>

      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress
          variant="indeterminate"
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: '#333',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #90caf9, #ce93d8)',
              borderRadius: 4,
            },
          }}
        />
      </Box>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: '#666' }}>
          Epochs: {progress.toLocaleString()} / 10,000+
        </Typography>
      </Box>
    </Paper>
  );
};