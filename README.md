# AI Insights - Stock Price Predictor

An intelligent stock market analysis platform powered by AI technology, providing real-time predictions and comprehensive market insights.

## Features

- 🤖 AI-powered stock price predictions using LSTM neural networks
- 📊 Real-time stock data and interactive charts
- 🔍 Advanced technical analysis with 50+ indicators
- 📰 Company news and sentiment analysis
- 🔐 Secure Firebase authentication with admin roles
- 📱 Responsive design for all devices

## Tech Stack

### Frontend
- React 18
- React Router v7
- Chart.js & Recharts
- Tailwind CSS
- Lucide React Icons
- Firebase Auth

### Backend
- Python 3.12
- Flask
- TensorFlow/Keras (LSTM model)
- Firebase Admin SDK
- Twelve Data API
- Finnhub API

## Prerequisites

- Python 3.12+
- Node.js 18+
- Firebase project with Authentication enabled
- Twelve Data API key
- Finnhub API key (optional)

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/Naveenkumar-2007/Ai-insights.git
cd Ai-insights
```

### 2. Backend Setup

```bash
cd VIONEX-finance-Ai-Stock-price-predictor-main

# Install Python dependencies
pip install -r requirements.txt

# Create .env file at project root
cp ../.env.example .env
```

Edit `.env` with your credentials:

```env
TWELVE_DATA_API_KEY=your_twelve_data_api_key
FINNHUB_API_KEY=your_finnhub_api_key
FIREBASE_SERVICE_ACCOUNT_PATH=path/to/firebase-admin.json
ADMIN_EMAILS=admin@example.com
ALLOWED_ORIGINS=http://localhost:3000
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
REACT_APP_ADMIN_EMAILS=admin@example.com
```

### 4. Run Development Servers

**Backend:**
```bash
cd VIONEX-finance-Ai-Stock-price-predictor-main
python run.py
```
Backend runs on `http://localhost:5000`

**Frontend:**
```bash
cd frontend
npm start
```
Frontend runs on `http://localhost:3000`

## Azure Deployment

### Prerequisites

1. Azure account with active subscription
2. Azure CLI installed
3. GitHub repository configured

### Setup CI/CD Pipeline

1. **Create Azure Web App**

```bash
az webapp create \
  --name ai-insights-app \
  --resource-group your-resource-group \
  --plan your-app-service-plan \
  --runtime "PYTHON:3.12"
```

2. **Configure GitHub Secrets**

Go to your repository Settings → Secrets and variables → Actions, and add:

- `AZURE_WEBAPP_PUBLISH_PROFILE` - Download from Azure Portal
- `TWELVE_DATA_API_KEY`
- `FINNHUB_API_KEY`
- `FIREBASE_SERVICE_ACCOUNT_JSON` - Entire JSON content
- `ADMIN_EMAILS` - Comma-separated emails
- `ALLOWED_ORIGINS` - Production URL
- `REACT_APP_API_URL` - Your Azure app URL
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`
- `REACT_APP_FIREBASE_MEASUREMENT_ID`
- `REACT_APP_ADMIN_EMAILS`
- `AZURE_RESOURCE_GROUP`
- `AZURE_STORAGE_ACCOUNT` (optional)
- `AZURE_STORAGE_KEY` (optional)

3. **Push to GitHub**

```bash
git remote add origin https://github.com/Naveenkumar-2007/Ai-insights.git
git add .
git commit -m "Initial commit with Azure deployment"
git push -u origin main
```

The GitHub Actions workflow will automatically:
- Build the React frontend
- Install Python dependencies
- Deploy to Azure Web App
- Configure environment variables

### Manual Azure Deployment (Alternative)

```bash
# Build frontend
cd frontend
npm run build

# Copy build to Flask
cp -r build ../VIONEX-finance-Ai-Stock-price-predictor-main/

# Deploy
cd ../VIONEX-finance-Ai-Stock-price-predictor-main
az webapp up --name ai-insights-app --resource-group your-rg
```

## Admin Role Setup

To promote a user to admin:

```bash
node scripts/promote-admin.js
```

Or manually add their email to `ADMIN_EMAILS` environment variable.

## Project Structure

```
.
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── contexts/           # React contexts (Auth)
│   │   ├── pages/              # Page components
│   │   └── styles/             # Tailwind CSS
│   ├── public/
│   └── package.json
├── VIONEX-finance-Ai-Stock-price-predictor-main/
│   ├── app.py                  # Flask application
│   ├── stock_api.py            # API integrations
│   ├── run.py                  # Server entry point
│   ├── wsgi.py                 # WSGI config
│   ├── mlops/                  # ML pipeline
│   ├── artifacts/              # Trained models
│   └── requirements.txt
├── scripts/
│   └── promote-admin.js        # Admin promotion script
├── .github/
│   └── workflows/
│       └── azure-deploy.yml    # CI/CD pipeline
└── README.md
```

## Environment Variables

### Backend (.env)
- `TWELVE_DATA_API_KEY` - Required for stock data
- `FINNHUB_API_KEY` - Optional for additional data
- `FIREBASE_SERVICE_ACCOUNT_PATH` - Path to Firebase admin JSON
- `ADMIN_EMAILS` - Comma-separated admin emails
- `ALLOWED_ORIGINS` - CORS allowed origins
- `LOG_LEVEL` - Logging level (default: INFO)

### Frontend (.env)
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_FIREBASE_*` - Firebase configuration
- `REACT_APP_ADMIN_EMAILS` - Admin email allowlist

## Security

- ✅ Firebase Authentication with ID token verification
- ✅ CORS protection with configurable origins
- ✅ Admin role-based access control
- ✅ Secure environment variable management
- ✅ Request logging and error handling
- ✅ Service account credentials (never commit to git)

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- GitHub Issues: https://github.com/Naveenkumar-2007/Ai-insights/issues
- Email: support@ai-insights.com

## Disclaimer

AI Insights is an analytical tool designed to assist with investment research. All predictions and analyses are for informational purposes only and should not be considered as financial advice. Past performance does not guarantee future results. Always conduct your own research and consult with qualified financial advisors before making investment decisions.

---

© 2025 AI Insights. Built with AI technology.
