from sklearn.metrics import root_mean_squared_error
from sklearn.preprocessing import StandardScaler

import torch
import torch.nn as nn
import torch.optim as optim

import pandas as pd
import numpy as np
import yfinance as yf
import joblib
import os

# Set device for PyTorch
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Directory to save trained models
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')


class DataFetcher:
    def __init__(self, ticker, start_date, end_date):
        self.ticker = ticker
        self.start_date = start_date
        self.end_date = end_date

    def fetch_data(self):
        data = yf.download(self.ticker, start=self.start_date, end=self.end_date)
        return data


# Define the LSTM model
# This code defines a PyTorch neural network model called PredictionModel, which is designed to predict stock prices based on sequences of closing price data. The model consists of an LSTM layer followed by a fully connected layer. The LSTM layer processes the input sequences and captures temporal dependencies, while the fully connected layer maps the output of the LSTM to the desired output size (the predicted closing price). The forward method defines how the input data flows through the model during the forward pass.

class PredictionModel(nn.Module):
    def __init__(self, input_size, hidden_size, num_layers, output_size):

        # Call the constructor of the parent class (nn.Module) to initialize the model. This is necessary for the model to work properly and to be able to use PyTorch's built-in functionalities for training and inference.

        super(PredictionModel, self).__init__()
        
        # Initialize the model parameters. The input_size parameter specifies the number of features in the input data (in this case, 1 for the closing price), hidden_size specifies the number of features in the hidden state of the LSTM, num_layers specifies the number of stacked LSTM layers, and output_size specifies the number of output features (in this case, 1 for the predicted closing price).
        # These parameters are stored as instance variables for use in the forward method.
        self.num_layers =  num_layers
        self.hidden_size = hidden_size


        # Define the layers of the model. The LSTM layer is defined with the specified input size, hidden size, and number of layers. The batch_first=True argument indicates that the input and output tensors will have the batch size as the first dimension. The fully connected layer (fc) is defined to map the hidden state output from the LSTM to the desired output size (the predicted closing price).
        # The layers are stored as instance variables so that they can be used in the forward method to define the forward pass of the model.
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)


    # Define the forward pass of the model. The forward method takes an input tensor x, initializes the hidden state (h0) and cell state (c0) for the LSTM, and then passes the input through the LSTM layer. The output from the LSTM is then passed through the fully connected layer to produce the final prediction. The method returns the predicted closing price.
    # The hidden state and cell state are initialized to zeros and moved to the specified device (CPU or GPU) to ensure that they are compatible with the input data and can take advantage of GPU acceleration if available.
    def forward(self, x):
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(device)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(device)


        # Pass the input through the LSTM layer. The output from the LSTM is a tuple containing the output for all time steps and the final hidden and cell states. We are interested in the output for all time steps, which is stored in the variable 'out'. The final hidden and cell states (hn and cn) are not used in this implementation but are returned by the LSTM layer.
        # The detach() method is used to prevent gradients from being calculated for the hidden and cell states during backpropagation, which can help reduce memory usage and improve training efficiency.
        # The output from the LSTM layer is then passed through the fully connected layer to produce the final prediction. The out[:, -1, :] syntax selects the output from the last time step for each sequence in the batch, which is what we want to use for predicting the next closing price.

        out, (hn, cn) = self.lstm(x, (h0.detach(), c0.detach()))
        out = self.fc(out[:, -1, :])
        return out

    def save_model(self, ticker, scaler):
        """Save model and scaler to disk."""
        os.makedirs(MODELS_DIR, exist_ok=True)
        model_path = os.path.join(MODELS_DIR, f'{ticker}.pt')
        scaler_path = os.path.join(MODELS_DIR, f'{ticker}_scaler.pkl')
        torch.save(self.state_dict(), model_path)
        joblib.dump(scaler, scaler_path)
        return model_path, scaler_path

    @staticmethod
    def load_model(ticker):
        """Load a saved model and scaler for a ticker."""
        model_path = os.path.join(MODELS_DIR, f'{ticker}.pt')
        scaler_path = os.path.join(MODELS_DIR, f'{ticker}_scaler.pkl')

        if not os.path.exists(model_path) or not os.path.exists(scaler_path):
            return None, None

        model = PredictionModel(input_size=1, hidden_size=50, num_layers=2, output_size=1).to(device)
        model.load_state_dict(torch.load(model_path, weights_only=True))
        model.eval()
        scaler = joblib.load(scaler_path)
        return model, scaler


class StockTrainer:
    """Class to handle data preparation, training, and prediction."""

    SEQ_LENGTH = 60  # Sequence length for LSTM

    def __init__(self, ticker):
        self.ticker = ticker.upper()
        self.model = None
        self.scaler = None
        self.stock_data = None
        self.last_sequence = None

    def fetch_data(self, start_date='2010-01-01', end_date=None):
        """Fetch historical stock data."""
        if end_date is None:
            end_date = pd.Timestamp.now().strftime('%Y-%m-%d')
        fetcher = DataFetcher(self.ticker, start_date, end_date)
        self.stock_data = fetcher.fetch_data()
        return self.stock_data

    def prepare_data(self):
        """Prepare data for training."""
        if self.stock_data is None:
            raise ValueError("No data fetched. Call fetch_data() first.")

        self.scaler = StandardScaler()
        scaled_data = self.scaler.fit_transform(self.stock_data['Close'].values.reshape(-1, 1))

        # Create sequences
        data = []
        for i in range(len(scaled_data) - self.SEQ_LENGTH):
            data.append(scaled_data[i:i+self.SEQ_LENGTH])

        data = np.array(data)

        # Split into train/test
        train_size = int(0.8 * len(data))
        X_train = torch.from_numpy(data[:train_size, :-1, :]).float().to(device)
        y_train = torch.from_numpy(data[:train_size, -1, :]).float().to(device)
        X_test = torch.from_numpy(data[train_size:, :-1, :]).float().to(device)
        y_test = torch.from_numpy(data[train_size:, -1, :]).float().to(device)

        # Store last sequence for future predictions
        self.last_sequence = scaled_data[-self.SEQ_LENGTH-1:-1]

        return X_train, y_train, X_test, y_test

    def train_model(self, epochs=10000, progress_callback=None):
        """Train the LSTM model."""
        X_train, y_train, X_test, y_test = self.prepare_data()

        self.model = PredictionModel(input_size=1, hidden_size=50, num_layers=2, output_size=1).to(device)
        criterion = nn.MSELoss()
        optimizer = optim.Adam(self.model.parameters(), lr=0.01)

        for epoch in range(epochs):
            self.model.train()
            y_pred = self.model(X_train)
            loss = criterion(y_pred, y_train)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            if progress_callback and epoch % 100 == 0:
                progress_callback(epoch, epochs, loss.item())

        self.model.eval()
        return self.model

    def save_model(self):
        """Save the trained model and scaler."""
        if self.model is None or self.scaler is None:
            raise ValueError("No trained model to save.")
        return self.model.save_model(self.ticker, self.scaler)

    def load_model(self):
        """Load existing model for the ticker."""
        self.model, self.scaler = PredictionModel.load_model(self.ticker)
        return self.model is not None

    def predict_future(self, future_date):
        """Predict stock price for a future date."""
        if self.model is None:
            if not self.load_model():
                raise ValueError(f"No trained model found for {self.ticker}")

        if self.stock_data is None:
            self.fetch_data()

        if self.scaler is None:
            raise ValueError("Scaler not initialized. Train or load a model first.")

        self.model.eval()

        # Calculate number of days to predict
        last_date = self.stock_data.index[-1]
        future_date = pd.Timestamp(future_date)
        days_to_predict = (future_date - last_date).days

        if days_to_predict <= 0:
            raise ValueError("Future date must be after the last available data date.")

        # Get the last sequence for prediction
        last_sequence = self.scaler.transform(self.stock_data['Close'].values[-self.SEQ_LENGTH:].reshape(-1, 1))

        predictions = []
        current_sequence = last_sequence.copy()

        with torch.no_grad():
            for _ in range(days_to_predict):
                seq_tensor = torch.from_numpy(current_sequence[-self.SEQ_LENGTH-1:-1].reshape(1, -1, 1)).float().to(device)
                pred = self.model(seq_tensor)
                pred_np = pred.cpu().numpy()
                predictions.append(pred_np[0, 0])
                current_sequence = np.append(current_sequence, pred_np).reshape(-1, 1)

        # Inverse transform predictions
        predictions = np.array(predictions).reshape(-1, 1)
        predictions = self.scaler.inverse_transform(predictions)

        # Generate future dates
        future_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=days_to_predict)

        return {
            'ticker': self.ticker,
            'last_date': last_date.strftime('%Y-%m-%d'),
            'prediction_date': future_date.strftime('%Y-%m-%d'),
            'predicted_price': float(predictions[-1, 0]),
            'predictions': [{'date': d.strftime('%Y-%m-%d'), 'price': float(p)}
                          for d, p in zip(future_dates, predictions.flatten())],
            'historical_data': {
                'dates': [d.strftime('%Y-%m-%d') for d in self.stock_data.index[-60:]],
                'prices': [float(p) for p in self.stock_data['Close'].values[-60:].flatten()]
            }
        }