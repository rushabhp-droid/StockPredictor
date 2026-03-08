import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';

interface TickerInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const TickerInput: React.FC<TickerInputProps> = ({ value, onChange, disabled }) => {
  return (
    <TextField
      fullWidth
      label="Stock Ticker"
      value={value}
      onChange={(e) => onChange(e.target.value.toUpperCase())}
      disabled={disabled}
      placeholder="e.g., AAPL, GOOGL, TSLA"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <ShowChartIcon sx={{ color: '#90caf9' }} />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiInputBase-input': {
          fontSize: '1.25rem',
          fontWeight: 500,
          letterSpacing: '0.1em',
        },
      }}
    />
  );
};