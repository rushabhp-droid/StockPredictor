import axios from 'axios';

const API_BASE_URL = '/api';

export interface PredictionResult {
  ticker: string;
  last_date: string;
  prediction_date: string;
  predicted_price: number;
  predictions: Array<{ date: string; price: number }>;
  historical_data: {
    dates: string[];
    prices: number[];
  };
}

export interface ModelInfo {
  ticker: string;
  model_file: string;
  scaler_file: string;
}

export interface TrainResult {
  success: boolean;
  ticker: string;
  epochs_trained: number;
  model_path: string;
  scaler_path: string;
  message: string;
}

class ApiService {
  async healthCheck() {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  }

  async getModels(): Promise<{ models: ModelInfo[]; count: number }> {
    const response = await axios.get(`${API_BASE_URL}/models`);
    return response.data;
  }

  async trainModel(
    ticker: string,
    epochs: number = 10000,
    startDate?: string,
    endDate?: string
  ): Promise<TrainResult> {
    const response = await axios.post(`${API_BASE_URL}/train`, {
      ticker,
      epochs,
      start_date: startDate,
      end_date: endDate,
    });
    return response.data;
  }

  async predict(
    ticker: string,
    futureDate: string,
    trainIfMissing: boolean = true,
    epochs: number = 10000
  ): Promise<PredictionResult> {
    const response = await axios.post(`${API_BASE_URL}/predict`, {
      ticker,
      future_date: futureDate,
      train_if_missing: trainIfMissing,
      epochs,
    });
    return response.data;
  }

  async checkModelStatus(ticker: string): Promise<{ ticker: string; model_exists: boolean }> {
    const response = await axios.get(`${API_BASE_URL}/train-status/${ticker}`);
    return response.data;
  }

  async deleteModel(ticker: string): Promise<{ success: boolean; message: string }> {
    const response = await axios.delete(`${API_BASE_URL}/delete-model/${ticker}`);
    return response.data;
  }
}

export const api = new ApiService();