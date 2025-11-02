"""
Gunicorn configuration for Azure App Service
Optimized for ML model loading with TensorFlow/Keras
"""

import multiprocessing
import os

# Server Socket - Get port from environment
bind = f"0.0.0.0:{os.environ.get('PORT', '8000')}"
backlog = 2048

# Worker Processes
workers = 1  # Use 1 worker to avoid multiple model loads (saves memory)
worker_class = 'sync'
worker_connections = 1000
timeout = 300  # 5 minutes - reduced for faster startup detection
keepalive = 5
graceful_timeout = 60  # Reduced graceful timeout

# Pre-load app before forking workers
preload_app = True

# Logging
loglevel = 'info'
accesslog = '-'  # Log to stdout
errorlog = '-'   # Log to stderr
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process Naming
proc_name = 'ai-insights-stock-predictor'

# Server Mechanics
daemon = False
pidfile = None
umask = 0
user = None
group = None
tmp_upload_dir = None

# Preload optimization
def on_starting(server):
    """
    Called just before the master process is initialized.
    """
    server.log.info("=" * 60)
    server.log.info("Starting AI Insights Stock Prediction App")
    server.log.info("Loading TensorFlow and LSTM model...")
    server.log.info("Port: %s", os.environ.get('PORT', '8000'))
    server.log.info("=" * 60)

def when_ready(server):
    """
    Called just after the server is started.
    """
    server.log.info("=" * 60)
    server.log.info("Gunicorn server ready and listening")
    server.log.info("=" * 60)

def worker_int(worker):
    """
    Called when worker receives INT or QUIT signal
    """
    worker.log.info("Worker received INT or QUIT signal")

def worker_abort(worker):
    """
    Called when worker receives SIGABRT signal
    """
    worker.log.info("Worker received SIGABRT signal")
