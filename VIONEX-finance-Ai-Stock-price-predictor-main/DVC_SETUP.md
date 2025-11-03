# DVC Configuration for Model Versioning

# Initialize DVC (run this once)
# dvc init

# Configure remote storage (Azure Blob Storage)
# dvc remote add -d azure azblob://models/stockpredictor
# dvc remote modify azure account_name aiinsightstorage

# Track model artifacts
# dvc add artifacts/stock_lstm_model.h5
# dvc add artifacts/scaler.pkl

# Push to remote
# dvc push

# Pull from remote
# dvc pull

# Update model
# dvc add artifacts/stock_lstm_model.h5 -f
# git add artifacts/stock_lstm_model.h5.dvc
# git commit -m "Update model version"
# dvc push
