"""
Automatic Model Training and Performance Improvement
Trains models every hour using recent market data
"""

import os
import json
import pickle
import logging
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import warnings

warnings.filterwarnings('ignore')

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('ModelTrainer')

# Directories
MODELS_DIR = 'artifacts/models'
METRICS_DIR = 'artifacts/metrics'
TRAINING_DATA_DIR = 'artifacts/training_data'

for directory in [MODELS_DIR, METRICS_DIR, TRAINING_DATA_DIR]:
    os.makedirs(directory, exist_ok=True)


class StockModelTrainer:
    """Trains and manages stock prediction models"""
    
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.performance_history = []
        self.load_existing_models()
    
    def load_existing_models(self):
        """Load previously trained models if they exist"""
        try:
            models_file = os.path.join(MODELS_DIR, 'ensemble_models.pkl')
            if os.path.exists(models_file):
                with open(models_file, 'rb') as f:
                    data = pickle.load(f)
                    self.models = data.get('models', {})
                    self.scalers = data.get('scalers', {})
                logger.info(f"✅ Loaded {len(self.models)} existing models")
            else:
                logger.info("📦 No existing models found, will train new ones")
        except Exception as e:
            logger.error(f"❌ Error loading models: {e}")
    
    def prepare_features(self, df):
        """Create technical features from price data"""
        df = df.copy()
        
        # Price-based features
        df['returns'] = df['close'].pct_change()
        df['log_returns'] = np.log(df['close'] / df['close'].shift(1))
        
        # Moving averages
        df['sma_5'] = df['close'].rolling(window=5).mean()
        df['sma_10'] = df['close'].rolling(window=10).mean()
        df['sma_20'] = df['close'].rolling(window=20).mean()
        df['ema_12'] = df['close'].ewm(span=12, adjust=False).mean()
        df['ema_26'] = df['close'].ewm(span=26, adjust=False).mean()
        
        # MACD
        df['macd'] = df['ema_12'] - df['ema_26']
        df['macd_signal'] = df['macd'].ewm(span=9, adjust=False).mean()
        df['macd_hist'] = df['macd'] - df['macd_signal']
        
        # Bollinger Bands
        df['bb_middle'] = df['close'].rolling(window=20).mean()
        bb_std = df['close'].rolling(window=20).std()
        df['bb_upper'] = df['bb_middle'] + (bb_std * 2)
        df['bb_lower'] = df['bb_middle'] - (bb_std * 2)
        df['bb_width'] = df['bb_upper'] - df['bb_lower']
        
        # RSI
        delta = df['close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df['rsi'] = 100 - (100 / (1 + rs))
        
        # Volatility
        df['volatility'] = df['returns'].rolling(window=20).std()
        
        # Volume features
        if 'volume' in df.columns:
            df['volume_sma'] = df['volume'].rolling(window=20).mean()
            df['volume_ratio'] = df['volume'] / df['volume_sma']
        
        # Lag features (past prices)
        for lag in [1, 2, 3, 5, 7]:
            df[f'close_lag_{lag}'] = df['close'].shift(lag)
            df[f'returns_lag_{lag}'] = df['returns'].shift(lag)
        
        # Drop NaN values
        df = df.dropna()
        
        return df
    
    def train_model(self, ticker, historical_data):
        """Train models for a specific stock ticker"""
        try:
            logger.info(f"🎯 Training models for {ticker}...")
            
            # Prepare data
            df = historical_data.copy()
            df = self.prepare_features(df)
            
            if len(df) < 50:
                logger.warning(f"⚠️ Not enough data for {ticker} ({len(df)} rows)")
                return None
            
            # Feature columns
            feature_cols = [col for col in df.columns if col not in ['close', 'date', 'open', 'high', 'low', 'volume']]
            
            # Create target (next day's closing price)
            df['target'] = df['close'].shift(-1)
            df = df.dropna()
            
            X = df[feature_cols].values
            y = df['target'].values
            
            # Split data (80% train, 20% test)
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, shuffle=False
            )
            
            # Scale features
            scaler = MinMaxScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)
            
            # Train ensemble models
            models = {
                'random_forest': RandomForestRegressor(
                    n_estimators=100,
                    max_depth=10,
                    min_samples_split=5,
                    min_samples_leaf=2,
                    random_state=42,
                    n_jobs=-1
                ),
                'gradient_boosting': GradientBoostingRegressor(
                    n_estimators=100,
                    learning_rate=0.1,
                    max_depth=5,
                    min_samples_split=5,
                    min_samples_leaf=2,
                    random_state=42
                )
            }
            
            trained_models = {}
            predictions = {}
            
            for name, model in models.items():
                logger.info(f"  Training {name}...")
                model.fit(X_train_scaled, y_train)
                
                # Evaluate
                y_pred = model.predict(X_test_scaled)
                mse = mean_squared_error(y_test, y_pred)
                mae = mean_absolute_error(y_test, y_pred)
                r2 = r2_score(y_test, y_pred)
                
                logger.info(f"  {name} - MSE: {mse:.4f}, MAE: {mae:.4f}, R²: {r2:.4f}")
                
                trained_models[name] = model
                predictions[name] = y_pred
            
            # Ensemble prediction (weighted average)
            ensemble_pred = 0.6 * predictions['random_forest'] + 0.4 * predictions['gradient_boosting']
            ensemble_mse = mean_squared_error(y_test, ensemble_pred)
            ensemble_mae = mean_absolute_error(y_test, ensemble_pred)
            ensemble_r2 = r2_score(y_test, ensemble_pred)
            
            logger.info(f"  ✅ Ensemble - MSE: {ensemble_mse:.4f}, MAE: {ensemble_mae:.4f}, R²: {ensemble_r2:.4f}")
            
            # Save models
            self.models[ticker] = trained_models
            self.scalers[ticker] = scaler
            
            # Save metrics
            metrics = {
                'ticker': ticker,
                'timestamp': datetime.now().isoformat(),
                'data_points': len(df),
                'features': feature_cols,
                'models': {
                    'random_forest': {'mse': float(mse), 'mae': float(mae), 'r2': float(r2)},
                    'gradient_boosting': {'mse': float(mse), 'mae': float(mae), 'r2': float(r2)},
                    'ensemble': {'mse': float(ensemble_mse), 'mae': float(ensemble_mae), 'r2': float(ensemble_r2)}
                }
            }
            
            metrics_file = os.path.join(METRICS_DIR, f'{ticker}_metrics.json')
            with open(metrics_file, 'w') as f:
                json.dump(metrics, f, indent=2)
            
            self.performance_history.append(metrics)
            
            return metrics
            
        except Exception as e:
            logger.error(f"❌ Error training {ticker}: {e}")
            return None
    
    def save_models(self):
        """Save all trained models to disk"""
        try:
            models_file = os.path.join(MODELS_DIR, 'ensemble_models.pkl')
            with open(models_file, 'wb') as f:
                pickle.dump({
                    'models': self.models,
                    'scalers': self.scalers,
                    'timestamp': datetime.now().isoformat()
                }, f)
            logger.info(f"💾 Saved {len(self.models)} models to {models_file}")
        except Exception as e:
            logger.error(f"❌ Error saving models: {e}")
    
    def predict(self, ticker, current_data):
        """Make predictions using trained models"""
        try:
            if ticker not in self.models:
                logger.warning(f"⚠️ No model found for {ticker}")
                return None
            
            # Prepare features
            df = current_data.copy()
            df = self.prepare_features(df)
            
            feature_cols = [col for col in df.columns if col not in ['close', 'date', 'open', 'high', 'low', 'volume', 'target']]
            X = df[feature_cols].tail(1).values
            
            # Scale
            scaler = self.scalers[ticker]
            X_scaled = scaler.transform(X)
            
            # Predict with ensemble
            models = self.models[ticker]
            rf_pred = models['random_forest'].predict(X_scaled)[0]
            gb_pred = models['gradient_boosting'].predict(X_scaled)[0]
            
            # Weighted ensemble
            ensemble_pred = 0.6 * rf_pred + 0.4 * gb_pred
            
            return {
                'prediction': float(ensemble_pred),
                'random_forest': float(rf_pred),
                'gradient_boosting': float(gb_pred),
                'current_price': float(df['close'].iloc[-1])
            }
            
        except Exception as e:
            logger.error(f"❌ Error predicting for {ticker}: {e}")
            return None
    
    def get_model_performance(self):
        """Get overall model performance statistics"""
        if not self.performance_history:
            return None
        
        total_models = len(self.performance_history)
        avg_r2 = np.mean([m['models']['ensemble']['r2'] for m in self.performance_history])
        avg_mae = np.mean([m['models']['ensemble']['mae'] for m in self.performance_history])
        
        return {
            'total_models': total_models,
            'average_r2': float(avg_r2),
            'average_mae': float(avg_mae),
            'last_training': self.performance_history[-1]['timestamp'] if self.performance_history else None,
            'tickers': list(self.models.keys())
        }


# Global trainer instance
trainer = StockModelTrainer()


def train_popular_stocks():
    """Train models for popular stocks"""
    from stock_api import fetch_stock_data_cached
    
    popular_stocks = ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'AMD']
    
    logger.info("🚀 Starting automatic model training...")
    
    trained_count = 0
    for ticker in popular_stocks:
        try:
            # Fetch historical data
            stock_data = fetch_stock_data_cached(ticker, days=180)
            
            if stock_data and 'historical_data' in stock_data:
                hist_df = pd.DataFrame({
                    'date': stock_data['historical_data']['dates'],
                    'close': stock_data['historical_data']['prices']
                })
                
                # Train model
                metrics = trainer.train_model(ticker, hist_df)
                if metrics:
                    trained_count += 1
                    
        except Exception as e:
            logger.error(f"❌ Error training {ticker}: {e}")
    
    # Save all models
    trainer.save_models()
    
    logger.info(f"✅ Training complete! Trained {trained_count}/{len(popular_stocks)} models")
    
    return trainer.get_model_performance()


if __name__ == '__main__':
    # Test training
    train_popular_stocks()
