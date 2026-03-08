import os
import json
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

from model import PredictionModel, StockTrainer, MODELS_DIR

app = Flask(__name__)
CORS(app)


def get_available_models():
    """Get list of available trained models."""
    if not os.path.exists(MODELS_DIR):
        return []
    models = []
    for file in os.listdir(MODELS_DIR):
        if file.endswith('.pt'):
            ticker = file[:-3]  # Remove .pt extension
            scaler_file = f"{ticker}_scaler.pkl"
            if os.path.exists(os.path.join(MODELS_DIR, scaler_file)):
                models.append({
                    'ticker': ticker,
                    'model_file': file,
                    'scaler_file': scaler_file
                })
    return models


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })


@app.route('/api/models', methods=['GET'])
def list_models():
    """List all available trained models."""
    models = get_available_models()
    return jsonify({
        'models': models,
        'count': len(models)
    })


@app.route('/api/train', methods=['POST'])
def train_model():
    """Train a new model for a ticker."""
    data = request.get_json()

    if not data or 'ticker' not in data:
        return jsonify({'error': 'Ticker is required'}), 400

    ticker = data['ticker'].upper()
    epochs = data.get('epochs', 10000)
    start_date = data.get('start_date', '2010-01-01')
    end_date = data.get('end_date')

    # Progress tracking for potential SSE/WebSocket future implementation
    progress_updates = []

    def progress_callback(epoch, total_epochs, loss):
        progress_updates.append({
            'epoch': epoch,
            'total_epochs': total_epochs,
            'loss': loss
        })

    try:
        trainer = StockTrainer(ticker)

        # Fetch data
        trainer.fetch_data(start_date=start_date, end_date=end_date)

        # Train model
        trainer.train_model(epochs=epochs, progress_callback=progress_callback)

        # Save model
        model_path, scaler_path = trainer.save_model()

        return jsonify({
            'success': True,
            'ticker': ticker,
            'epochs_trained': epochs,
            'model_path': model_path,
            'scaler_path': scaler_path,
            'message': f'Model trained successfully for {ticker}'
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/predict', methods=['POST'])
def predict():
    """Make a prediction for a ticker and future date."""
    data = request.get_json()

    if not data:
        return jsonify({'error': 'Request body is required'}), 400

    ticker = data.get('ticker')
    future_date = data.get('future_date')
    train_if_missing = data.get('train_if_missing', True)
    epochs = data.get('epochs', 10000)

    if not ticker:
        return jsonify({'error': 'Ticker is required'}), 400

    if not future_date:
        return jsonify({'error': 'Future date is required'}), 400

    try:
        ticker = ticker.upper()

        # Validate future date
        try:
            prediction_date = datetime.strptime(future_date, '%Y-%m-%d')
            if prediction_date <= datetime.now():
                return jsonify({'error': 'Future date must be in the future'}), 400
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

        trainer = StockTrainer(ticker)

        # Try to load existing model
        model_loaded = trainer.load_model()

        if not model_loaded:
            if train_if_missing:
                # Train new model
                trainer.fetch_data()
                trainer.train_model(epochs=epochs)
                trainer.save_model()
            else:
                return jsonify({
                    'error': f'No trained model found for {ticker}. Set train_if_missing=true to train automatically.'
                }), 404

        # Make prediction
        result = trainer.predict_future(future_date)

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/train-status/<ticker>', methods=['GET'])
def train_status(ticker):
    """Check if a model exists for a ticker."""
    ticker = ticker.upper()
    model_path = os.path.join(MODELS_DIR, f'{ticker}.pt')
    scaler_path = os.path.join(MODELS_DIR, f'{ticker}_scaler.pkl')

    exists = os.path.exists(model_path) and os.path.exists(scaler_path)

    return jsonify({
        'ticker': ticker,
        'model_exists': exists,
        'model_path': model_path if exists else None
    })


@app.route('/api/delete-model/<ticker>', methods=['DELETE'])
def delete_model(ticker):
    """Delete a trained model."""
    ticker = ticker.upper()
    model_path = os.path.join(MODELS_DIR, f'{ticker}.pt')
    scaler_path = os.path.join(MODELS_DIR, f'{ticker}_scaler.pkl')

    deleted = False

    try:
        if os.path.exists(model_path):
            os.remove(model_path)
            deleted = True
        if os.path.exists(scaler_path):
            os.remove(scaler_path)
            deleted = True

        if deleted:
            return jsonify({
                'success': True,
                'message': f'Model deleted for {ticker}'
            })
        else:
            return jsonify({
                'success': False,
                'message': f'No model found for {ticker}'
            }), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    # Ensure models directory exists
    os.makedirs(MODELS_DIR, exist_ok=True)

    app.run(debug=True, host='0.0.0.0', port=5000)