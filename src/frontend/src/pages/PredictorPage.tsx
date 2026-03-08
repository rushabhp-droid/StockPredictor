import React, { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  Typography,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  CircularProgress
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import { TickerInput } from '../components/TickerInput';
import { DatePicker } from '../components/DatePicker';
import { TrainingProgress } from '../components/TrainingProgress';
import { PredictionChart } from '../components/PredictionChart';
import { api, PredictionResult, ModelInfo } from '../services/api';

export const PredictorPage: React.FC = () => {
  const [ticker, setTicker] = useState('');
  const [futureDate, setFutureDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [modelExists, setModelExists] = useState(false);

  const checkModelExists = async (tickerToCheck: string) => {
    try {
      const status = await api.checkModelStatus(tickerToCheck);
      setModelExists(status.model_exists);
      return status.model_exists;
    } catch {
      return false;
    }
  };

  const handleTickerChange = async (newTicker: string) => {
    setTicker(newTicker);
    setPrediction(null);
    setError(null);
    if (newTicker.length >= 1) {
      const exists = await checkModelExists(newTicker);
      setModelExists(exists);
    } else {
      setModelExists(false);
    }
  };

  const loadAvailableModels = async () => {
    try {
      const response = await api.getModels();
      setAvailableModels(response.models);
    } catch (err) {
      console.error('Failed to load models:', err);
    }
  };

  const handlePredict = async () => {
    if (!ticker) {
      setError('Please enter a stock ticker');
      return;
    }
    if (!futureDate) {
      setError('Please select a future date');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const exists = await checkModelExists(ticker);
      if (!exists) {
        setIsTraining(true);
      }

      const result = await api.predict(ticker, futureDate, true);
      setPrediction(result);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
      setIsTraining(false);
    }
  };

  React.useEffect(() => {
    loadAvailableModels();
  }, []);

  return (
    <Box>
      {/* Input Section */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 3,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          border: '1px solid #333',
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: '#90caf9', mb: 3 }}>
          Predict Stock Prices with LSTM
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <TickerInput
              value={ticker}
              onChange={handleTickerChange}
              disabled={isLoading}
            />
            {ticker && (
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={modelExists ? 'Model Available' : 'Needs Training'}
                  color={modelExists ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={5}>
            <DatePicker
              value={futureDate}
              onChange={setFutureDate}
              disabled={isLoading}
              label="Prediction Date"
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handlePredict}
              disabled={isLoading || !ticker || !futureDate}
              sx={{
                height: '56px',
                background: 'linear-gradient(90deg, #90caf9, #ce93d8)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #64b5f6, #ba68c8)',
                },
                '&:disabled': {
                  background: '#333',
                  color: '#666',
                },
              }}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
            >
              {isLoading ? 'Processing...' : 'Predict'}
            </Button>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {/* Training Progress */}
      <TrainingProgress
        isTraining={isTraining}
        ticker={ticker}
      />

      {/* Results Section */}
      {prediction && (
        <Box className="fade-in">
          {/* Summary Card */}
          <Card
            elevation={3}
            sx={{
              mb: 3,
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              border: '1px solid #333',
            }}
          >
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <TrendingUpIcon sx={{ fontSize: 48, color: '#90caf9' }} />
                </Grid>
                <Grid item xs>
                  <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                    {ticker}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#888' }}>
                    Prediction for {prediction.prediction_date}
                  </Typography>
                </Grid>
                <Grid item>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h3" sx={{ color: '#ce93d8', fontWeight: 700 }}>
                      ${prediction.predicted_price.toFixed(2)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#888' }}>
                      Predicted Price
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2, borderColor: '#333' }} />

              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <Typography variant="body2" sx={{ color: '#888' }}>
                    Last Available Data
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#fff' }}>
                    {prediction.last_date}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" sx={{ color: '#888' }}>
                    Days Predicted
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#fff' }}>
                    {prediction.predictions.length} days
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" sx={{ color: '#888' }}>
                    Data Points Used
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#fff' }}>
                    {prediction.historical_data.dates.length} days
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Chart */}
          <PredictionChart
            historicalDates={prediction.historical_data.dates}
            historicalPrices={prediction.historical_data.prices}
            predictionDates={prediction.predictions.map(p => p.date)}
            predictionPrices={prediction.predictions.map(p => p.price)}
            ticker={prediction.ticker}
          />
        </Box>
      )}

      {/* Available Models Section */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mt: 3,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          border: '1px solid #333',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ModelTrainingIcon sx={{ color: '#90caf9', mr: 1 }} />
          <Typography variant="h6" sx={{ color: '#90caf9' }}>
            Available Trained Models
          </Typography>
        </Box>

        {availableModels.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#888' }}>
            No trained models yet. Train a model by making a prediction.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {availableModels.map((model) => (
              <Chip
                key={model.ticker}
                label={model.ticker}
                variant="outlined"
                sx={{ borderColor: '#90caf9', color: '#90caf9' }}
                onClick={() => handleTickerChange(model.ticker)}
              />
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};