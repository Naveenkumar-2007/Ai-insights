from flask import Flask, request, render_template, jsonify, send_from_directory, g
from flask_cors import CORS
import os
from datetime import datetime, timedelta
import warnings
import logging
from logging.handlers import RotatingFileHandler
from functools import wraps
from werkzeug.exceptions import HTTPException

warnings.filterwarnings('ignore')

try:
    import firebase_admin
    from firebase_admin import auth as firebase_auth, credentials
except ImportError:  # Firebase admin is optional; admin endpoints will be disabled if missing
    firebase_admin = None
    firebase_auth = None
    credentials = None

from dotenv import load_dotenv

load_dotenv()

# Heavy imports (pandas, numpy, ta, stock_api) will be lazy-loaded when needed
# to improve startup time for Azure App Service

# Model will be loaded lazily on first use
MODEL_PATH = 'artifacts/stock_lstm_model.h5'
model = None
model_loading_attempted = False

SUFFIX_EXCHANGE_COUNTRY = {
    '.NS': ('NSE', 'India'),
    '.BO': ('BSE', 'India'),
    '.L': ('LSE', 'United Kingdom'),
    '.HK': ('HKEX', 'Hong Kong'),
    '.TO': ('TSX', 'Canada'),
    '.AX': ('ASX', 'Australia'),
    '.SI': ('SGX', 'Singapore'),
    '.SS': ('SSE', 'China'),
    '.SZ': ('SZSE', 'China'),
    '.F': ('FWB', 'Germany'),
    '.SW': ('SIX', 'Switzerland'),
    '.PA': ('EURONEXT', 'France'),
    '.MC': ('BME', 'Spain'),
    '.MI': ('Borsa Italiana', 'Italy')
}


def _parse_env_list(value: str | None, default: list[str]) -> list[str]:
    if not value:
        return default
    return [item.strip() for item in value.split(',') if item.strip()]


def configure_logging(flask_app: Flask) -> None:
    log_level = os.getenv('LOG_LEVEL', 'INFO').upper()
    handler = RotatingFileHandler('logs/app.log', maxBytes=1_048_576, backupCount=3)
    handler.setFormatter(logging.Formatter('[%(asctime)s] %(levelname)s in %(module)s: %(message)s'))
    os.makedirs('logs', exist_ok=True)
    flask_app.logger.addHandler(handler)
    flask_app.logger.setLevel(log_level)
    logging.getLogger('werkzeug').setLevel(log_level)


def initialize_firebase_admin() -> bool:
    if firebase_admin is None or credentials is None:
        return False

    if firebase_admin._apps:  # type: ignore[attr-defined]
        return True

    service_account_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH')
    if not service_account_path or not os.path.exists(service_account_path):
        return False

    cred = credentials.Certificate(service_account_path)
    firebase_admin.initialize_app(cred)
    return True


print("=" * 60)
print("Stock Predictor App - Using Twelve Data API")
print("=" * 60)

# Configure Flask to serve React build (optimized)
application = Flask(__name__, static_folder='build', static_url_path='')
app = application

configure_logging(app)

# Allow CORS from all origins for API endpoints
ALLOWED_ORIGINS = _parse_env_list(os.getenv('ALLOWED_ORIGINS'), ['*'])
CORS(app, resources={r"/api/*": {"origins": ALLOWED_ORIGINS}}, supports_credentials=True)

firebase_ready = initialize_firebase_admin()
if firebase_ready:
    app.logger.info('Firebase Admin SDK initialised successfully.')
else:
    app.logger.warning('Firebase Admin SDK not configured. Admin-only endpoints are disabled.')

ADMIN_EMAILS = {email.lower() for email in _parse_env_list(os.getenv('ADMIN_EMAILS'), [])}


def _user_has_admin_privileges(claims: dict) -> bool:
    if not claims:
        return False

    if claims.get('admin') is True:
        return True

    email = (claims.get('email') or '').lower()
    return bool(email and email in ADMIN_EMAILS)


def firebase_auth_required(admin_only: bool = False):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if firebase_auth is None:
                app.logger.warning('Attempted to access a secured endpoint without Firebase Admin configured.')
                return jsonify({'success': False, 'error': 'Auth service unavailable'}), 503

            auth_header = request.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return jsonify({'success': False, 'error': 'Missing authentication token'}), 401

            token = auth_header.split(' ', 1)[1].strip()
            try:
                decoded = firebase_auth.verify_id_token(token, check_revoked=True)
            except Exception as exc:  # pylint: disable=broad-except
                app.logger.info('Invalid or expired token: %s', exc)
                return jsonify({'success': False, 'error': 'Invalid or expired token'}), 401

            if admin_only and not _user_has_admin_privileges(decoded):
                return jsonify({'success': False, 'error': 'Insufficient privileges'}), 403

            g.firebase_user = decoded
            return func(*args, **kwargs)

        return wrapper

    return decorator


@app.errorhandler(HTTPException)
def handle_http_exception(exc: HTTPException):
    app.logger.warning('HTTP error: %s', exc.description)
    response = exc.get_response()
    response.data = jsonify({'success': False, 'error': exc.description}).data
    response.content_type = 'application/json'
    return response


@app.errorhandler(Exception)
def handle_unexpected_exception(exc: Exception):  # pylint: disable=broad-except
    app.logger.exception('Unhandled server error: %s', exc)
    return jsonify({'success': False, 'error': 'An unexpected server error occurred.'}), 500

def load_lstm_model():
    """Load the pre-trained LSTM model (lazy loading)"""
    global model, model_loading_attempted
    
    if model_loading_attempted:
        return model
        
    model_loading_attempted = True
    
    try:
        if os.path.exists(MODEL_PATH):
            print(f"Loading TensorFlow model from {MODEL_PATH}...")
            from tensorflow.keras.models import load_model
            model = load_model(MODEL_PATH)
            print(f"Model loaded successfully from {MODEL_PATH}")
        else:
            print(f"Warning: Model file not found at {MODEL_PATH}")
    except Exception as e:
        print(f"Error loading model: {e}")
    
    return model

# Health check endpoint (minimal dependencies)
@app.route('/api/health')
def health_check():
    """Simple health check endpoint"""
    return jsonify({
        'success': True,
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

# Serve React App (with caching)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """Serve React frontend with proper caching"""
    try:
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            response = send_from_directory(app.static_folder, path)
            # Cache static assets for 1 year
            if path.startswith('static/'):
                response.cache_control.max_age = 31536000
                response.cache_control.public = True
            return response
        else:
            response = send_from_directory(app.static_folder, 'index.html')
            # Don't cache index.html
            response.cache_control.no_cache = True
            response.cache_control.no_store = True
            response.cache_control.must_revalidate = True
            return response
    except Exception as e:
        app.logger.error(f"Error serving static file {path}: {e}")
        return jsonify({'error': 'Page not found'}), 404

# API Routes
@app.route('/api/search')
def search_tickers():
    """Search tickers across global exchanges."""
    # Lazy import stock_api
    from stock_api import search_symbols
    
    query = request.args.get('q', default='', type=str).strip()
    limit = request.args.get('limit', default=5, type=int)
    limit = max(1, min(limit, 10))

    if not query:
        return jsonify({'success': True, 'results': []})

    try:
        results = search_symbols(query, limit)
        return jsonify({'success': True, 'results': results})
    except Exception as exc:
        print(f"Error in search endpoint: {exc}")
        return jsonify({'success': False, 'results': [], 'error': 'Search failed'}), 500

@app.route('/api/stock/<ticker>')
def get_stock_data(ticker):
    """Get comprehensive stock data with prediction and profit/loss analysis"""
    # Lazy import heavy dependencies
    import pandas as pd
    import numpy as np
    import ta
    from stock_api import (
        get_stock_history, 
        get_intraday_data,
        get_company_profile,
        get_company_metrics,
        get_quote_data,
        search_symbols
    )
    
    days = request.args.get('days', default=7, type=int)
    days = max(1, min(days, 30))  # Limit between 1-30 days
    
    try:
        requested_ticker = ticker.upper()
        resolved_ticker = requested_ticker
        resolved_exchange = None
        resolved_country = None
        data_provider = None
        provider_message = None

        candidates = [{'symbol': requested_ticker, 'exchange': None, 'country': None}]
        seen_candidates = {(requested_ticker, None)}

        try:
            search_results = search_symbols(requested_ticker, limit=5)
        except Exception as search_exc:
            print(f"Symbol search fallback warning: {search_exc}")
            search_results = []

        for match in search_results:
            symbol = (match.get('symbol') or '').upper()
            exchange = (match.get('exchange') or '').upper() or None
            country = match.get('country') or None
            if not symbol:
                continue
            key = (symbol, exchange)
            if key in seen_candidates:
                continue
            seen_candidates.add(key)
            candidates.append({
                'symbol': symbol,
                'exchange': exchange,
                'country': country
            })

        hist = pd.DataFrame()
        history_info = {}

        for candidate in candidates:
            candidate_hist, info = get_stock_history(
                candidate['symbol'],
                days=180,
                exchange=candidate.get('exchange'),
                country=candidate.get('country'),
                return_info=True
            )

            if not candidate_hist.empty and len(candidate_hist) >= 2:
                hist = candidate_hist
                history_info = info or {}
                resolved_ticker = info.get('symbol', candidate['symbol']).upper()
                resolved_exchange = (candidate.get('exchange') or '').upper() or resolved_exchange
                resolved_country = candidate.get('country') or resolved_country
                data_provider = info.get('source')
                provider_message = info.get('provider_message')
                break

            if not provider_message and info.get('provider_message'):
                provider_message = info['provider_message']

        if resolved_exchange is None:
            for suffix, (exchange_name, country_name) in SUFFIX_EXCHANGE_COUNTRY.items():
                if resolved_ticker.endswith(suffix):
                    resolved_exchange = exchange_name
                    if resolved_country is None:
                        resolved_country = country_name
                    break
        elif resolved_country is None:
            for _, (exchange_name, country_name) in SUFFIX_EXCHANGE_COUNTRY.items():
                if resolved_exchange == exchange_name:
                    resolved_country = country_name
                    break

        # Validate data
        if hist.empty or len(hist) < 2:
            suggestion_candidates = [c.get('symbol') for c in candidates[1:] if c.get('symbol')]
            suggestions = [sym for sym in suggestion_candidates if sym != requested_ticker][:3]

            detail_parts = []
            # Don't expose internal API provider messages to users
            if suggestions:
                detail_parts.append(f"Try: {', '.join(suggestions)}")

            error_text = f'No data found for {requested_ticker}.'
            if detail_parts:
                error_text = f"{error_text} {' '.join(detail_parts)}"

            return jsonify({
                'success': False,
                'error': error_text.strip()
            }), 404

        # Handle multi-index columns if needed
        if isinstance(hist.columns, pd.MultiIndex):
            hist.columns = hist.columns.get_level_values(0)

        # Ensure we have Close column
        if 'Close' not in hist.columns:
            return jsonify({
                'success': False,
                'error': f'Invalid data structure for {resolved_ticker}'
            }), 500

        metadata_symbols = []
        for candidate_symbol in [resolved_ticker, requested_ticker, history_info.get('symbol')]:
            if candidate_symbol and candidate_symbol.upper() not in metadata_symbols:
                metadata_symbols.append(candidate_symbol.upper())
        if not metadata_symbols and requested_ticker:
            metadata_symbols.append(requested_ticker.upper())

        print(
            "Resolved ticker: requested={}, used={}, exchange={}, provider={}".format(
                requested_ticker,
                resolved_ticker,
                resolved_exchange or 'N/A',
                data_provider or 'primary'
            )
        )
        if provider_message:
            print(f"Provider note: {provider_message}")

        # Current price
        current_price = float(hist['Close'].iloc[-1])
        previous_close = float(hist['Close'].iloc[-2]) if len(hist) > 1 else current_price

        # Calculate technical indicators
        hist['SMA_20'] = hist['Close'].rolling(window=20).mean()
        hist['SMA_50'] = hist['Close'].rolling(window=50).mean()
        hist['EMA_20'] = hist['Close'].ewm(span=20, adjust=False).mean()
        hist['RSI'] = ta.momentum.RSIIndicator(hist['Close']).rsi()

        macd_indicator = ta.trend.MACD(hist['Close'])
        hist['MACD'] = macd_indicator.macd()
        hist['MACD_signal'] = macd_indicator.macd_signal()
        hist['MACD_histogram'] = macd_indicator.macd_diff()

        hist = hist.dropna()
        if hist.empty or len(hist) < 5:
            return jsonify({
                'success': False,
                'error': f'Insufficient data for technical analysis'
            }), 500

        # Latest indicators helper
        latest_row = hist.iloc[-1]

        def safe_float(value, decimals=2):
            if value is None or (isinstance(value, float) and pd.isna(value)):
                return None
            return float(round(value, decimals))

        indicators = {
            'rsi': safe_float(latest_row.get('RSI')),
            'ema': safe_float(latest_row.get('EMA_20')),
            'macd': safe_float(latest_row.get('MACD'), 3),
            'macd_signal': safe_float(latest_row.get('MACD_signal'), 3),
            'macd_histogram': safe_float(latest_row.get('MACD_histogram'), 3),
            'sma20': safe_float(latest_row.get('SMA_20')),
            'sma50': safe_float(latest_row.get('SMA_50'))
        }

        # Predictions
        predictions = predict_multi_day_lstm(hist, current_price, days)

        # Company fundamentals
        company_profile = None
        profile_symbol_used = None
        for symbol_option in metadata_symbols:
            profile_candidate = get_company_profile(symbol_option)
            company_profile = profile_candidate
            profile_symbol_used = symbol_option
            if profile_candidate and (
                profile_candidate.get('market_cap') or
                profile_candidate.get('name', '').upper() != symbol_option.upper()
            ):
                break

        if company_profile is None:
            company_profile = {
                'name': resolved_ticker,
                'market_cap': None,
                'industry': 'N/A',
                'logo': '',
                'country': resolved_country or 'N/A',
                'currency': None,
                'exchange': resolved_exchange or ''
            }

        company_metrics = None
        metrics_symbol_used = None
        for symbol_option in metadata_symbols:
            metrics_candidate = get_company_metrics(symbol_option)
            company_metrics = metrics_candidate
            metrics_symbol_used = symbol_option
            if metrics_candidate and any(
                isinstance(metrics_candidate.get(key), (int, float)) and not pd.isna(metrics_candidate.get(key))
                for key in ('pe_ratio', 'eps')
            ):
                break

        if company_metrics is None:
            company_metrics = {'pe_ratio': None, 'eps': None}

        quote_data = None
        quote_symbol_used = None
        for symbol_option in metadata_symbols:
            quote_candidate = get_quote_data(symbol_option)
            if quote_candidate:
                quote_data = quote_candidate
                quote_symbol_used = symbol_option
                break

        company_name = company_profile.get('name', resolved_ticker)
        market_cap = company_profile.get('market_cap')
        if not isinstance(market_cap, (int, float)) or pd.isna(market_cap) or market_cap <= 0:
            market_cap = None
        pe_ratio = company_metrics.get('pe_ratio') if isinstance(company_metrics, dict) else None
        volume = int(hist['Volume'].iloc[-1]) if 'Volume' in hist.columns else 0

        if quote_data:
            quote_current = quote_data.get('current')
            quote_previous = quote_data.get('previous_close')
            if isinstance(quote_current, (int, float)) and quote_current > 0:
                current_price = float(quote_current)
            if isinstance(quote_previous, (int, float)) and quote_previous > 0:
                previous_close = float(quote_previous)

        day_change = current_price - previous_close
        day_change_percent = (day_change / previous_close) * 100 if previous_close else 0

        tomorrow_prediction = predictions[0] if predictions else current_price
        profit_loss = tomorrow_prediction - current_price
        profit_loss_percent = (profit_loss / current_price) * 100 if current_price else 0

        signal_score = profit_loss_percent
        if signal_score >= 2:
            ai_signal = 'STRONG BUY'
        elif signal_score >= 0.5:
            ai_signal = 'BUY'
        elif signal_score <= -2:
            ai_signal = 'STRONG SELL'
        elif signal_score <= -0.5:
            ai_signal = 'SELL'
        else:
            ai_signal = 'HOLD'

        fallback_used = bool(data_provider and data_provider.lower() != 'twelvedata')

        # Historical data
        chart_slice = hist.tail(30)
        historical_data = {
            'dates': [date.strftime('%Y-%m-%d') for date in chart_slice.index],
            'prices': [safe_float(price) for price in chart_slice['Close'].tolist()]
        }

        today = datetime.now()
        future_predictions = [
            {
                'date': (today + timedelta(days=index + 1)).strftime('%Y-%m-%d'),
                'price': safe_float(price)
            }
            for index, price in enumerate(predictions)
        ]

        recent_ohlcv = hist.tail(60)
        candlestick_data = []
        volume_data = []
        for index, row in recent_ohlcv.iterrows():
            date_str = index.strftime('%Y-%m-%d')
            candlestick_data.append({
                'date': date_str,
                'open': safe_float(row['Open']),
                'high': safe_float(row['High']),
                'low': safe_float(row['Low']),
                'close': safe_float(row['Close'])
            })
            if 'Volume' in row:
                volume_data.append({
                    'date': date_str,
                    'volume': int(float(row['Volume'])) if not pd.isna(row['Volume']) else 0
                })

        ma_data = {'sma20': [], 'sma50': []}
        for index, row in recent_ohlcv.iterrows():
            date_str = index.strftime('%Y-%m-%d')
            if not pd.isna(row['SMA_20']):
                ma_data['sma20'].append({'date': date_str, 'value': safe_float(row['SMA_20'])})
            if not pd.isna(row['SMA_50']):
                ma_data['sma50'].append({'date': date_str, 'value': safe_float(row['SMA_50'])})

        def calc_period_change(window):
            if len(hist) <= window:
                return None
            start = hist['Close'].iloc[-window - 1]
            end = hist['Close'].iloc[-1]
            if pd.isna(start) or start == 0:
                return None
            return safe_float(((end - start) / start) * 100)

        performance = {
            '1W': calc_period_change(5),
            '1M': calc_period_change(21),
            '3M': calc_period_change(63),
            '1Y': calc_period_change(252)
        }

        perf_slice = hist['Close'].tail(90)
        performance_chart = {
            'dates': [date.strftime('%Y-%m-%d') for date in perf_slice.index],
            'prices': [safe_float(price) for price in perf_slice.tolist()]
        }

        indicator_slice = hist.tail(40)
        indicator_trends = {
            'rsi': {
                'dates': [date.strftime('%Y-%m-%d') for date in indicator_slice.index],
                'values': [safe_float(val) if not pd.isna(val) else None for val in indicator_slice['RSI'].tolist()]
            },
            'ema': {
                'dates': [date.strftime('%Y-%m-%d') for date in indicator_slice.index],
                'values': [safe_float(val) if not pd.isna(val) else None for val in indicator_slice['EMA_20'].tolist()]
            },
            'macd': {
                'dates': [date.strftime('%Y-%m-%d') for date in indicator_slice.index],
                'values': [safe_float(val, 3) if not pd.isna(val) else None for val in indicator_slice['MACD'].tolist()],
                'histogram': [safe_float(val, 3) if not pd.isna(val) else None for val in indicator_slice['MACD_histogram'].tolist()]
            }
        }

        response = {
            'success': True,
            'ticker': resolved_ticker,
            'requested_ticker': requested_ticker,
            'resolved_exchange': resolved_exchange,
            'resolved_country': resolved_country,
            'used_fallback_source': fallback_used,
            'company_name': company_name,
            'current_price': safe_float(current_price),
            'predicted_price': safe_float(tomorrow_prediction),
            'profit_loss': safe_float(profit_loss),
            'profit_loss_percent': safe_float(profit_loss_percent),
            'is_profit': bool(profit_loss > 0),
            'ai_signal': ai_signal,
            'day_change': safe_float(day_change),
            'day_change_percent': safe_float(day_change_percent),
            'volume': volume,
            'market_cap': market_cap,
            'pe_ratio': safe_float(pe_ratio) if isinstance(pe_ratio, (int, float)) and not pd.isna(pe_ratio) else None,
            'days_predicted': days,
            'indicators': indicators,
            'historical_data': historical_data,
            'future_predictions': future_predictions,
            'technical_chart': {
                'candles': candlestick_data,
                'volumes': volume_data,
                'moving_averages': ma_data
            },
            'indicator_trends': indicator_trends,
            'performance': performance,
            'performance_chart': performance_chart,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

        if app.debug and provider_message:
            response['provider_note'] = provider_message
        if app.debug and profile_symbol_used:
            response['profile_symbol_used'] = profile_symbol_used
        if app.debug and quote_symbol_used:
            response['quote_symbol_used'] = quote_symbol_used
        if app.debug and metrics_symbol_used:
            response['metrics_symbol_used'] = metrics_symbol_used

        return jsonify(response)

    except Exception as e:
        import traceback
        print(f"ERROR: {traceback.format_exc()}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/news/<ticker>')
def get_news(ticker):
    """Get company news"""
    # Lazy import stock_api
    from stock_api import get_company_news
    
    try:
        ticker = ticker.upper()
        days = request.args.get('days', default=7, type=int)
        
        news = get_company_news(ticker, days=days)
        
        return jsonify({
            'success': True,
            'ticker': ticker,
            'news': news
        })
        
    except Exception as e:
        print(f"ERROR fetching news: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/sentiment/<ticker>')
def get_sentiment(ticker):
    """Get sentiment analysis"""
    # Lazy import stock_api
    from stock_api import get_sentiment_analysis
    
    try:
        ticker = ticker.upper()
        sentiment = get_sentiment_analysis(ticker)
        
        return jsonify({
            'success': True,
            'ticker': ticker,
            'sentiment': sentiment
        })
        
    except Exception as e:
        print(f"ERROR fetching sentiment: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/admin/system-health')
@firebase_auth_required(admin_only=True)
def admin_system_health():
    metrics = {
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'modelPath': MODEL_PATH,
        'modelLoaded': model is not None,
        'modelFilePresent': os.path.exists(MODEL_PATH),
        'firebaseAdminConfigured': firebase_ready,
        'allowedOrigins': ALLOWED_ORIGINS,
        'adminEmailsConfigured': bool(ADMIN_EMAILS)
    }

    return jsonify({'success': True, 'metrics': metrics})

def predict_multi_day_lstm(hist, current_price, days):
    """Predict multiple days ahead using LSTM model"""
    # Lazy import numpy
    import numpy as np
    
    predictions = []
    
    try:
        current_model = load_lstm_model()
        
        if current_model is None:
            for day in range(days):
                pred = predict_with_technical_analysis(hist, current_price)
                predictions.append(pred)
                current_price = pred
            return predictions
        
        from sklearn.preprocessing import MinMaxScaler
        
        close_prices = hist['Close'].values.reshape(-1, 1)
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(close_prices)
        
        sequence_length = min(60, len(scaled_data))
        last_sequence = list(scaled_data[-sequence_length:])
        
        for day in range(days):
            input_seq = np.array(last_sequence[-sequence_length:]).reshape(1, sequence_length, 1)
            predicted_scaled = current_model.predict(input_seq, verbose=0)[0][0]
            last_sequence.append([predicted_scaled])
            predicted_price = scaler.inverse_transform([[predicted_scaled]])[0][0]
            predictions.append(float(predicted_price))
        
        return predictions
        
    except Exception as e:
        print(f"LSTM error: {e}")
        for day in range(days):
            pred = predict_with_technical_analysis(hist, current_price)
            predictions.append(pred)
            current_price = pred
        return predictions

def predict_with_technical_analysis(hist, current_price):
    """Fallback prediction using technical indicators"""
    try:
        last_row = hist.iloc[-1]
        recent_prices = hist['Close'].tail(5).values
        trend = (recent_prices[-1] - recent_prices[0]) / recent_prices[0]
        
        prediction_change = 0
        
        rsi = last_row['RSI']
        if rsi < 30:
            prediction_change += 0.01
        elif rsi > 70:
            prediction_change -= 0.01
        
        if current_price > last_row['SMA_20'] and last_row['SMA_20'] > last_row['SMA_50']:
            prediction_change += 0.005
        elif current_price < last_row['SMA_20'] and last_row['SMA_20'] < last_row['SMA_50']:
            prediction_change -= 0.005
        
        if last_row['MACD'] > 0:
            prediction_change += 0.003
        else:
            prediction_change -= 0.003
        
        prediction_change += trend * 0.3
        predicted_price = current_price * (1 + prediction_change)
        return predicted_price
        
    except Exception as e:
        return current_price * 1.002

if __name__ == '__main__':
    # Get port from environment variable (Azure sets this)
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)