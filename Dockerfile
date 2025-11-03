# Multi-stage build for optimized image size
# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-builder

# Build arguments for React environment variables
ARG REACT_APP_API_URL=https://aiinsight-fyhyenesh4d2hee9.centralindia-01.azurewebsites.net
ARG REACT_APP_FIREBASE_API_KEY
ARG REACT_APP_FIREBASE_AUTH_DOMAIN
ARG REACT_APP_FIREBASE_PROJECT_ID
ARG REACT_APP_FIREBASE_STORAGE_BUCKET
ARG REACT_APP_FIREBASE_MESSAGING_SENDER_ID
ARG REACT_APP_FIREBASE_APP_ID
ARG REACT_APP_FIREBASE_MEASUREMENT_ID
ARG REACT_APP_FIREBASE_CLIENT_ID
ARG REACT_APP_ADMIN_EMAILS

# Set as environment variables for npm build
ENV REACT_APP_API_URL=${REACT_APP_API_URL} \
    REACT_APP_FIREBASE_API_KEY=${REACT_APP_FIREBASE_API_KEY} \
    REACT_APP_FIREBASE_AUTH_DOMAIN=${REACT_APP_FIREBASE_AUTH_DOMAIN} \
    REACT_APP_FIREBASE_PROJECT_ID=${REACT_APP_FIREBASE_PROJECT_ID} \
    REACT_APP_FIREBASE_STORAGE_BUCKET=${REACT_APP_FIREBASE_STORAGE_BUCKET} \
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=${REACT_APP_FIREBASE_MESSAGING_SENDER_ID} \
    REACT_APP_FIREBASE_APP_ID=${REACT_APP_FIREBASE_APP_ID} \
    REACT_APP_FIREBASE_MEASUREMENT_ID=${REACT_APP_FIREBASE_MEASUREMENT_ID} \
    REACT_APP_FIREBASE_CLIENT_ID=${REACT_APP_FIREBASE_CLIENT_ID} \
    REACT_APP_ADMIN_EMAILS=${REACT_APP_ADMIN_EMAILS}

WORKDIR /build
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Python backend with frontend
FROM python:3.12-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    libgomp1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -u 1000 appuser && \
    mkdir -p /app /app/logs /app/artifacts && \
    chown -R appuser:appuser /app

WORKDIR /app

# Copy requirements and install Python dependencies
COPY VIONEX-finance-Ai-Stock-price-predictor-main/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn gevent requests

# Copy application code
COPY --chown=appuser:appuser VIONEX-finance-Ai-Stock-price-predictor-main/ .

# Copy frontend build from previous stage
COPY --from=frontend-builder --chown=appuser:appuser /build/build ./build

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Start application with optimized gunicorn
CMD ["gunicorn", \
    "--bind", "0.0.0.0:8000", \
    "--workers", "2", \
    "--threads", "4", \
    "--worker-class", "gthread", \
    "--worker-tmp-dir", "/dev/shm", \
    "--timeout", "120", \
    "--graceful-timeout", "30", \
    "--keep-alive", "5", \
    "--max-requests", "1000", \
    "--max-requests-jitter", "100", \
    "--access-logfile", "-", \
    "--error-logfile", "-", \
    "--log-level", "info", \
    "wsgi:app"]
