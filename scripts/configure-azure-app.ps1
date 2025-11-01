# Post-Deployment Configuration for AI Insights
# Run these commands after deployment completes

# 1. Configure Application Settings
az webapp config appsettings set --name ai-insights --resource-group ai-insights-rg --settings `
  TWELVE_DATA_API_KEY="demo" `
  FINNHUB_API_KEY="demo" `
  FIREBASE_SERVICE_ACCOUNT_PATH="/home/site/wwwroot/firebase-admin.json" `
  ADMIN_EMAILS="naveenkumarchapala123@gmail.com" `
  ALLOWED_ORIGINS="https://ai-insights.azurewebsites.net" `
  WEBSITES_PORT="8000" `
  SCM_DO_BUILD_DURING_DEPLOYMENT="true"

# 2. Set startup command
az webapp config set --name ai-insights --resource-group ai-insights-rg `
  --startup-file "gunicorn --bind=0.0.0.0 --timeout 600 wsgi:app"

# 3. Restart the app
az webapp restart --name ai-insights --resource-group ai-insights-rg

Write-Host "Configuration complete!" -ForegroundColor Green
Write-Host "Your app URL: https://ai-insights.azurewebsites.net" -ForegroundColor Yellow
