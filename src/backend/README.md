# Stock Predictor - Backend Documentation

## 📋 Overview

The backend is the core component of the Stock Predictor system. It consists of two main parts:
- **main.ipynb**: An interactive Jupyter notebook for data exploration, preprocessing, and model experimentation
- **model.py**: A Python module containing reusable classes and utilities for stock price prediction

The backend orchestrates the complete pipeline from data retrieval through model training and evaluation.

## 🗂️ Backend Structure

```
backend/
├── README.md              # This file
├── main.ipynb            # Interactive notebook for exploration & training
├── model.py              # Core Python module with classes & utilities
├── requirements.txt      # Python dependencies
```

## 📄 Components

### main.ipynb
An interactive Jupyter notebook that demonstrates the complete workflow for stock price prediction.

**Key Features:**
- 📥 Historical stock data fetching and exploration
- 📊 Data visualization of price trends
- 🔧 Data preprocessing and normalization
- 🔗 Time-sequence creation for LSTM input (60-day windows)
- 🤖 PyTorch model setup with GPU/CPU configuration
- 📈 Model training and evaluation pipeline
- 🔮 Stock price prediction examples

**Best for:**
- Understanding the complete workflow
- Experimentation and prototyping
- Tuning model hyperparameters
- Visualizing results and exploring different stocks

### model.py
A Python module containing the foundational classes and utilities for the prediction system.

**Key Classes:**

#### `DataFetcher`
Encapsulates stock data retrieval logic.
```python
class DataFetcher:
    def __init__(self, ticker, start_date, end_date)
    def fetch_data() -> DataFrame
```
- **Parameters:**
  - `ticker` (str): Stock symbol (e.g., 'AAPL', 'GOOGL', 'MSFT')
  - `start_date` (str): Start date in 'YYYY-MM-DD' format
  - `end_date` (str): End date in 'YYYY-MM-DD' format
- **Returns:** pandas DataFrame with OHLC data from Yahoo Finance

**Example:**
```python
from model import DataFetcher

fetcher = DataFetcher('AAPL', '2023-01-01', '2024-01-01')
data = fetcher.fetch_data()
print(data.head())
```

## 🛠️ Key Features

### Data Retrieval
- Uses Yahoo Finance API via `yfinance` for accurate historical data
- Supports any publicly traded stock symbol
- Downloads OHLC (Open, High, Low, Close) data with volume information

### Data Preprocessing
- **Normalization**: StandardScaler for closing price standardization
- **Sequence Creation**: Converts time-series into 60-day sliding windows
- **Train-Test Split**: Proper temporal split to prevent data leakage

### Model Architecture
- **LSTM Neural Network**: Multi-layer LSTM cells for sequential learning
- **Dropout**: Regularization to prevent overfitting
- **Batch Normalization**: Speeds up training and improves stability

### Visualization
- Line charts for price trend analysis
- Interactive plots for exploration in Jupyter
- Training/validation loss curves for model evaluation

### Device Support
- Automatic GPU detection (CUDA support)
- Fallback to CPU processing
- Mixed precision training capability

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| **yfinance** | Latest | Fetch stock data from Yahoo Finance |
| **pandas** | Latest | Data manipulation and analysis |
| **numpy** | Latest | Numerical computations |
| **torch** | Latest | Deep learning framework (GPU support recommended) |
| **scikit-learn** | Latest | StandardScaler, metrics, preprocessing |
| **matplotlib** | Latest | Data visualization |
| **ipykernel** | Latest | Jupyter kernel support |

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Notebook
```bash
jupyter notebook main.ipynb
```

### 3. Fetch Data Programmatically
```python
from model import DataFetcher

# Fetch Apple stock data for the past year
fetcher = DataFetcher('AAPL', '2023-01-01', '2024-01-01')
apple_data = fetcher.fetch_data()

# Explore the data
print(apple_data.describe())
print(apple_data.head())
```

## 📊 Workflow

```
1. Data Fetching (DataFetcher)
           ↓
2. Data Preprocessing (Normalization, Sequence Creation)
           ↓
3. Train-Test Split (Temporal Split)
           ↓
4. Model Creation (LSTM Architecture)
           ↓
5. Training (with validation monitoring)
           ↓
6. Evaluation (RMSE, MAE metrics)
           ↓
7. Prediction (Future price forecasts)
```

## 📈 Expected Output

After training, the model provides:
- **Root Mean Square Error (RMSE)**: Prediction accuracy metric
- **Mean Absolute Error (MAE)**: Average prediction deviation
- **Visualization**: Actual vs. predicted price plots
- **Forecasts**: Future price predictions for the target stock

## ⚠️ Important Notes

1. **Market Volatility**: Stock prices are inherently unpredictable; use predictions as guidance only
2. **Data Quality**: Ensure sufficient historical data (preferably 2+ years)
3. **Backtesting**: Always backtest models before deployment
4. **GPU Acceleration**: Recommended for faster training on large datasets
5. **Retraining**: Regularly retrain models with new data for accuracy

## 🔗 Related Files

- Parent README: [../../README.md](../../README.md)
- License: [../../LICENSE](../../LICENSE)
- Main Notebook: [main.ipynb](main.ipynb)
- Model Code: [model.py](model.py)
- Requirements: [requirements.txt](requirements.txt)

## 🐛 Troubleshooting

**Issue**: `ModuleNotFoundError: No module named 'torch'`
- **Solution**: Run `pip install torch` or reinstall requirements: `pip install -r requirements.txt`

**Issue**: CUDA not detected (slower training)
- **Solution**: Install PyTorch with GPU support from https://pytorch.org

**Issue**: Yahoo Finance API errors
- **Solution**: Verify ticker symbol and date range are valid

## 📞 Support

For issues or questions related to the backend:
1. Check the error message and troubleshooting section above
2. Review the main.ipynb for examples
3. Consult PyTorch and scikit-learn documentation
4. Open an issue on the GitHub repository

---

**Last Updated**: March 2026
