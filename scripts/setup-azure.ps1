# Azure Setup Script for AI Insights Deployment
# Run this in PowerShell with Azure CLI installed

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "AI Insights - Azure Deployment Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Variables - Update these as needed
$RESOURCE_GROUP = "ai-insights-rg"
$LOCATION = "eastus"
$APP_SERVICE_PLAN = "ai-insights-plan"
$WEB_APP_NAME = "ai-insights-app"
$PYTHON_VERSION = "3.12"

Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  Resource Group: $RESOURCE_GROUP"
Write-Host "  Location: $LOCATION"
Write-Host "  App Service Plan: $APP_SERVICE_PLAN"
Write-Host "  Web App Name: $WEB_APP_NAME"
Write-Host ""

# Step 1: Login to Azure
Write-Host "[1/7] Logging into Azure..." -ForegroundColor Green
az login
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Azure login failed. Please try again." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Successfully logged in" -ForegroundColor Green
Write-Host ""

# Step 2: Create Resource Group
Write-Host "[2/7] Creating Resource Group..." -ForegroundColor Green
az group create --name $RESOURCE_GROUP --location $LOCATION
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create resource group" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Resource group created" -ForegroundColor Green
Write-Host ""

# Step 3: Create App Service Plan
Write-Host "[3/7] Creating App Service Plan (B1 tier)..." -ForegroundColor Green
az appservice plan create `
    --name $APP_SERVICE_PLAN `
    --resource-group $RESOURCE_GROUP `
    --location $LOCATION `
    --sku B1 `
    --is-linux
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create app service plan" -ForegroundColor Red
    exit 1
}
Write-Host "✅ App Service Plan created" -ForegroundColor Green
Write-Host ""

# Step 4: Create Web App
Write-Host "[4/7] Creating Web App with Python $PYTHON_VERSION..." -ForegroundColor Green
az webapp create `
    --name $WEB_APP_NAME `
    --resource-group $RESOURCE_GROUP `
    --plan $APP_SERVICE_PLAN `
    --runtime "PYTHON:$PYTHON_VERSION"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create web app" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Web App created" -ForegroundColor Green
Write-Host ""

# Step 5: Configure Web App settings
Write-Host "[5/7] Configuring Web App startup..." -ForegroundColor Green
az webapp config set `
    --name $WEB_APP_NAME `
    --resource-group $RESOURCE_GROUP `
    --startup-file "gunicorn --bind=0.0.0.0 --timeout 600 wsgi:app"
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Warning: Failed to set startup command" -ForegroundColor Yellow
}
Write-Host "✅ Startup configured" -ForegroundColor Green
Write-Host ""

# Step 6: Create Service Principal for GitHub Actions
Write-Host "[6/7] Creating Service Principal for GitHub Actions..." -ForegroundColor Green
$subscriptionId = az account show --query id -o tsv
$scope = "/subscriptions/$subscriptionId/resourceGroups/$RESOURCE_GROUP"

Write-Host "  Subscription ID: $subscriptionId"
Write-Host "  Creating service principal with Contributor role..."

$spOutput = az ad sp create-for-rbac `
    --name "github-ai-insights-deploy" `
    --role contributor `
    --scopes $scope `
    --sdk-auth

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create service principal" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Service Principal created" -ForegroundColor Green
Write-Host ""

# Step 7: Output Important Information
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "DEPLOYMENT INFORMATION" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🌐 Web App URL: " -NoNewline
Write-Host "https://$WEB_APP_NAME.azurewebsites.net" -ForegroundColor Yellow
Write-Host ""

Write-Host "📋 Add these GitHub Secrets:" -ForegroundColor Cyan
Write-Host "Go to: https://github.com/Naveenkumar-2007/Ai-insights/settings/secrets/actions"
Write-Host ""

Write-Host "1. AZURE_CREDENTIALS" -ForegroundColor Yellow
Write-Host "   Value (copy the entire JSON output below):"
Write-Host $spOutput -ForegroundColor Gray
Write-Host ""

Write-Host "2. AZURE_RESOURCE_GROUP" -ForegroundColor Yellow
Write-Host "   Value: $RESOURCE_GROUP"
Write-Host ""

Write-Host "3. REACT_APP_API_URL" -ForegroundColor Yellow
Write-Host "   Value: https://$WEB_APP_NAME.azurewebsites.net"
Write-Host ""

Write-Host "4. ALLOWED_ORIGINS" -ForegroundColor Yellow
Write-Host "   Value: https://$WEB_APP_NAME.azurewebsites.net"
Write-Host ""

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Copy the AZURE_CREDENTIALS JSON above and add it as a GitHub secret"
Write-Host "2. Add the following secrets to GitHub (if not already added):"
Write-Host "   - AZURE_CREDENTIALS (from above)"
Write-Host "   - AZURE_RESOURCE_GROUP: $RESOURCE_GROUP"
Write-Host "   - TWELVE_DATA_API_KEY (your API key)"
Write-Host "   - FINNHUB_API_KEY (your API key)"
Write-Host "   - FIREBASE_SERVICE_ACCOUNT_JSON (entire JSON content)"
Write-Host "   - ADMIN_EMAILS: naveenkumarchapala123@gmail.com"
Write-Host "   - ALLOWED_ORIGINS: https://$WEB_APP_NAME.azurewebsites.net"
Write-Host "   - REACT_APP_API_URL: https://$WEB_APP_NAME.azurewebsites.net"
Write-Host "   - All REACT_APP_FIREBASE_* secrets (from Firebase Console)"
Write-Host "   - REACT_APP_ADMIN_EMAILS: naveenkumarchapala123@gmail.com"
Write-Host ""
Write-Host "3. Update Firebase Authorized Domains:"
Write-Host "   Go to Firebase Console > Authentication > Settings > Authorized domains"
Write-Host "   Add: $WEB_APP_NAME.azurewebsites.net"
Write-Host ""
Write-Host "4. Push code to trigger deployment:"
Write-Host "   git push origin main"
Write-Host ""
Write-Host "✅ Azure setup complete!" -ForegroundColor Green
