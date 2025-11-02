#!/bin/bash
set -e
echo "=== Starting application setup ==="
cd /home/site/wwwroot
echo "Installing Python dependencies..."
pip install --no-cache-dir -r requirements.txt
echo "Starting Gunicorn server..."
exec gunicorn --bind=0.0.0.0:8000 --timeout 120 --workers 1 --worker-class sync --access-logfile - --error-logfile - wsgi:app
