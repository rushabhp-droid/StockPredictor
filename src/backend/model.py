from sklearn.metrics import root_mean_squared_error
from sklearn.preprocessing import StandardScaler

import torch
import torch.nn as nn
import torch.optim as optim

import pandas as pd
import numpy as np
import yfinance as yf


class DataFetcher:
    def __init__(self, ticker, start_date, end_date):
        self.ticker = ticker
        self.start_date = start_date
        self.end_date = end_date

    def fetch_data(self):
        data = yf.download(self.ticker, start=self.start_date, end=self.end_date)
        return data
    

def main():
    pass

if __name__ == "__main__":
    main()
