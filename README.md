# Stock Predictor

A machine learning-based stock price prediction system using LSTM neural networks and PyTorch.

## 📋 Overview

Stock Predictor is a deep learning project designed to forecast stock prices using Long Short-Term Memory (LSTM) neural networks. The system fetches historical stock data via Yahoo Finance, preprocesses it, and trains a PyTorch-based model to predict future price movements.

## 🗂️ Project Structure

```
StockPredictor/
├── LICENSE                 # GNU General Public License v3
├── README.md              # This file - Project documentation
└── src/
    └── backend/
        ├── README.md                # Backend component documentation
        ├── main.ipynb              # Jupyter notebook for data exploration & preprocessing
        ├── model.py                # Core model classes and utilities
        └── requirements.txt        # Python package dependencies
```

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- pip or conda

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/StockPredictor.git
cd StockPredictor
```

2. Install dependencies:
```bash
pip install -r src/backend/requirements.txt
```

### Usage

#### Interactive Exploration (Recommended for beginners)
Start with the Jupyter notebook for data exploration and preprocessing:
```bash
jupyter notebook src/backend/main.ipynb
```

#### Python Script
Use the Python module for programmatic access:
```python
from src.backend.model import DataFetcher

# Fetch stock data
fetcher = DataFetcher('AAPL', '2023-01-01', '2024-01-01')
data = fetcher.fetch_data()
```

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| **PyTorch** | Deep learning framework for building LSTM models |
| **yfinance** | Fetching historical stock data from Yahoo Finance |
| **pandas** | Data manipulation and analysis |
| **scikit-learn** | Machine learning utilities (scaling, metrics) |
| **matplotlib** | Data visualization |
| **numpy** | Numerical computations |

## 🔧 Components

### Backend (src/backend/)

#### main.ipynb
Interactive Jupyter notebook featuring:
- Historical stock data retrieval
- Data visualization and exploration
- Time-series preprocessing for LSTM
- Model training pipeline
- Prediction evaluation

#### model.py
Core Python module containing:
- **DataFetcher**: Class for downloading OHLC data from Yahoo Finance
- Utility functions for preprocessing
- Neural network architecture setup
- Training and evaluation logic

See [Backend Documentation](src/backend/README.md) for detailed component information.

## 📊 Workflow

1. **Data Collection**: Fetch historical OHLC data using Yahoo Finance API
2. **Preprocessing**: Normalize closing prices and create time sequences (60-day windows)
3. **Model Training**: Train LSTM network to predict future prices
4. **Evaluation**: Assess performance using RMSE and other metrics
5. **Prediction**: Generate forecasts for future stock prices

## 🔑 Features

- ✅ Real-time stock data retrieval
- ✅ Automatic data preprocessing and normalization
- ✅ GPU/CPU acceleration with PyTorch
- ✅ LSTM-based time-series forecasting
- ✅ Interactive Jupyter notebook for experimentation
- ✅ Modular, reusable Python classes

## 📝 License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs or issues
- Suggest new features
- Submit pull requests with improvements

## 📧 Contact

For questions or suggestions, please open an issue on the repository.

---

**Happy predicting! 📈**
