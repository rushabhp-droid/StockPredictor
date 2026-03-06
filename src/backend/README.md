# Stock Predictor - Backend Documentation

## Overview
The backend consists of two main components: `main.ipynb`, an interactive Jupyter notebook for data exploration and model preparation, and `model.py`, a Python script containing the core classes and utilities for stock price prediction.

## Components

### main.ipynb
An interactive Jupyter notebook that demonstrates the complete workflow for stock price prediction, including:
- Data fetching and visualization
- Data preprocessing and sequence creation for LSTM models
- PyTorch setup and device configuration

### model.py
A Python script containing the foundational classes for the stock prediction system:
- `DataFetcher`: Utility class for retrieving historical stock data
- Core imports for machine learning and deep learning libraries

## Features

### DataFetcher Class
A utility class that encapsulates stock data retrieval logic. It accepts a stock ticker symbol and date range, then downloads historical OHLC (Open, High, Low, Close) data using Yahoo Finance API.

### Data Preprocessing
The notebook includes preprocessing steps such as:
- Standardization of closing prices using StandardScaler
- Creation of time sequences for LSTM input (60-day sequences)

### Visualization
Basic line chart visualization of closing price trends over time using matplotlib.

### PyTorch Integration
Setup for GPU/CPU device selection and imports for neural network development.

## Dependencies
- `yfinance`: Fetches historical stock data from Yahoo Finance
- `pandas`: Data manipulation and analysis
- `matplotlib`: Data visualization
- `torch`: Deep learning framework
- `scikit-learn`: Machine learning utilities (StandardScaler, metrics)

## Usage
1. Run `main.ipynb` to explore data fetching, preprocessing, and visualization
2. Use `model.py` as a foundation for building the complete prediction model
3. Execute cells sequentially in the notebook to understand the workflow before implementing the full model