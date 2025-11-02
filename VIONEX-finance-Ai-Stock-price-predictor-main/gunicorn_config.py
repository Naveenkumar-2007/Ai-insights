"""
Gunicorn configuration for Azure App Service
Optimized for fast cold starts on Basic tier
"""

import multiprocessing
import os

# Server Socket - Get port from environment
bind = f"0.0.0.0:{os.environ.get('PORT', '8000')}"
backlog = 512

# Worker Processes - Single worker for minimal memory footprint
workers = 1
worker_class = 'sync'
worker_connections = 100
timeout = 120  # 2 minutes - fast startup required
keepalive = 2
graceful_timeout = 30

# CRITICAL: Disable preload to allow lazy loading
preload_app = False

# Logging
loglevel = 'info'
accesslog = '-'
errorlog = '-'
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

# Startup hook
def on_starting(server):
    """Called just before the master process is initialized."""
    server.log.info("="  * 60)
    server.log.info("AI Insights - Fast Startup Mode")
    server.log.info("ML libraries will be loaded on first use")
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
