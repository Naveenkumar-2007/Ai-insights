# 🤖 Automatic Model Training System

## Overview
This system automatically trains and improves stock prediction models every hour using ensemble machine learning techniques.

## Features

### ✅ Automatic Training
- **Runs every 1 hour** automatically in the background
- Trains on popular stocks: AAPL, TSLA, MSFT, GOOGL, AMZN, META, NVDA, AMD
- Uses 180 days of historical data for each stock
- Starts immediately when the app launches

### ✅ Ensemble Models
The system uses an ensemble of two powerful algorithms:

1. **Random Forest (60% weight)**
   - 100 trees
   - Max depth: 10
   - Handles non-linear patterns
   - Robust to outliers

2. **Gradient Boosting (40% weight)**
   - 100 estimators
   - Learning rate: 0.1
   - Captures complex market dynamics
   - Sequential error correction

### ✅ Advanced Features
The model creates 30+ technical features from price data:

**Price Features:**
- Returns and log returns
- Multiple moving averages (SMA 5, 10, 20)
- Exponential moving averages (EMA 12, 26)

**Technical Indicators:**
- MACD (with signal and histogram)
- Bollinger Bands (upper, lower, width)
- RSI (Relative Strength Index)
- Volatility measures

**Lag Features:**
- Past 1, 2, 3, 5, 7 days prices
- Past returns for pattern recognition

**Volume Analysis:**
- Volume moving average
- Volume ratio

## API Endpoints

### Get Model Performance
```bash
GET /api/models/performance
```

**Response:**
```json
{
  "success": true,
  "performance": {
    "total_models": 8,
    "average_r2": 0.87,
    "average_mae": 2.34,
    "last_training": "2025-11-05T16:30:00",
    "tickers": ["AAPL", "TSLA", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "AMD"]
  }
}
```

### Get Training Status
```bash
GET /api/models/training-status
```

**Response:**
```json
{
  "success": true,
  "status": {
    "is_running": true,
    "last_training": "2025-11-05T16:30:00",
    "next_training": "2025-11-05T17:30:00",
    "training_history": [...]
  }
}
```

### Trigger Manual Training
```bash
POST /api/models/train
```

**Response:**
```json
{
  "success": true,
  "message": "Model training started in background"
}
```

### Get ML Prediction
```bash
GET /api/models/predict/AAPL
```

**Response:**
```json
{
  "success": true,
  "ticker": "AAPL",
  "prediction": {
    "prediction": 268.45,
    "random_forest": 269.12,
    "gradient_boosting": 267.34,
    "current_price": 270.27
  }
}
```

## Performance Metrics

The system tracks three key metrics:

1. **R² Score** (Coefficient of Determination)
   - Measures how well the model fits the data
   - Range: 0 to 1 (higher is better)
   - Target: > 0.75

2. **MAE** (Mean Absolute Error)
   - Average prediction error in dollars
   - Lower is better
   - Target: < $5 per share

3. **MSE** (Mean Squared Error)
   - Squared error metric (penalizes large errors)
   - Lower is better

## File Structure

```
artifacts/
├── models/
│   └── ensemble_models.pkl       # Saved trained models
├── metrics/
│   ├── AAPL_metrics.json        # Performance metrics per stock
│   ├── TSLA_metrics.json
│   └── ...
└── training_data/
    └── [training datasets]
```

## How It Works

### Training Pipeline

```
1. Fetch Historical Data (180 days)
   ↓
2. Create Technical Features (30+ features)
   ↓
3. Prepare Train/Test Split (80/20)
   ↓
4. Scale Features (MinMaxScaler)
   ↓
5. Train Random Forest
   ↓
6. Train Gradient Boosting
   ↓
7. Create Ensemble Prediction
   ↓
8. Evaluate Performance (R², MAE, MSE)
   ↓
9. Save Models & Metrics
```

### Prediction Pipeline

```
1. User requests prediction for AAPL
   ↓
2. Fetch recent 60 days data
   ↓
3. Create same technical features
   ↓
4. Scale features using saved scaler
   ↓
5. Predict with Random Forest
   ↓
6. Predict with Gradient Boosting
   ↓
7. Combine: 0.6 × RF + 0.4 × GB
   ↓
8. Return ensemble prediction
```

## Model Performance Improvement

The system improves over time through:

1. **Continuous Learning**
   - Retrains every hour with latest data
   - Adapts to market changes
   - Captures new patterns

2. **Feature Engineering**
   - 30+ technical indicators
   - Multiple timeframes
   - Lag features for time-series patterns

3. **Ensemble Approach**
   - Combines strengths of multiple algorithms
   - Reduces individual model bias
   - More robust predictions

4. **Performance Tracking**
   - Monitors R², MAE, MSE over time
   - Keeps history of last 24 trainings
   - Allows performance trend analysis

## Configuration

Edit `model_trainer.py` to customize:

```python
# Training parameters
n_estimators=100          # Number of trees/estimators
max_depth=10              # Maximum tree depth
learning_rate=0.1         # GradientBoosting learning rate
test_size=0.2             # Train/test split ratio

# Ensemble weights
rf_weight = 0.6           # Random Forest contribution
gb_weight = 0.4           # Gradient Boosting contribution

# Popular stocks to train
popular_stocks = ['AAPL', 'TSLA', 'MSFT', 'GOOGL', ...]
```

Edit `scheduler.py` to change frequency:

```python
# Change training interval
schedule.every(1).hours.do(...)    # Current: Every 1 hour
schedule.every(30).minutes.do(...) # Alternative: Every 30 min
schedule.every().day.at("02:00").do(...) # Alternative: Daily at 2 AM
```

## Monitoring

### View Training Logs
```bash
# Check app logs for training status
tail -f logs/app.log | grep "Training"
```

### Check Model Files
```bash
# List trained models
ls -lh artifacts/models/

# View metrics for a specific stock
cat artifacts/metrics/AAPL_metrics.json
```

### Test Predictions
```bash
# Get prediction from trained model
curl http://localhost:8000/api/models/predict/AAPL
```

## Benefits

✅ **Better Accuracy**: Ensemble of 2 algorithms outperforms single models  
✅ **Always Improving**: Retrains every hour with latest market data  
✅ **Robust**: Handles market volatility and changing patterns  
✅ **Fast**: Cached models serve predictions instantly  
✅ **Scalable**: Easy to add more stocks or algorithms  
✅ **Monitored**: Performance metrics tracked over time  

## Future Enhancements

- [ ] Add more algorithms (XGBoost, LightGBM)
- [ ] Implement walk-forward optimization
- [ ] Add sentiment data as features
- [ ] Create custom feature importance analysis
- [ ] Implement A/B testing for model comparison
- [ ] Add alert system for poor model performance
- [ ] Integrate with live trading signals

## Requirements

```
scikit-learn>=1.3.0
pandas>=2.1.0
numpy>=1.24.0
schedule>=1.2.0
```

## Notes

- Models are saved to disk and persist across restarts
- Training runs in background thread (non-blocking)
- First training runs immediately on app startup
- Subsequent trainings run every hour
- Performance improves over time as more data is collected

---

**Status**: ✅ Active and Training  
**Last Updated**: November 5, 2025  
**Next Training**: Every hour (automatic)
