import React from 'react';
import { TextField } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  minDate?: string;
  label?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  disabled,
  minDate,
  label = 'Future Date'
}) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = minDate || tomorrow.toISOString().split('T')[0];

  return (
    <TextField
      fullWidth
      type="date"
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      inputProps={{
        min: minDateStr,
      }}
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{
        startAdornment: (
          <CalendarTodayIcon sx={{ color: '#90caf9', mr: 1 }} />
        ),
      }}
      sx={{
        '& input[type="date"]::-webkit-calendar-picker-indicator': {
          filter: 'invert(1)',
        },
      }}
    />
  );
};