# Update Azure API Keys for AI Insights
# This script updates the API keys in your Azure Web App

Write-Host "Updating API Keys in Azure Web App..." -ForegroundColor Cyan
Write-Host ""

# Azure Web App details
$appName = "Aiinsight"
$resourceGroup = "Ai_insights"

# New API Keys
$twelveDataKey = "891473de7e8c4fc8a4a1e3c9f6a4eb77"
$finnhubKey = "d455d59r01qsugt8oljgd455d59r01qsugt8olk0"
$alphaVantageKey = "F0OR00ZH5593UBZ7"

Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  App Name: $appName" -ForegroundColor White
Write-Host "  Resource Group: $resourceGroup" -ForegroundColor White
Write-Host "  Twelve Data API Key: $twelveDataKey" -ForegroundColor Green
Write-Host "  Finnhub API Key: $finnhubKey" -ForegroundColor Green
Write-Host "  Alpha Vantage API Key: $alphaVantageKey" -ForegroundColor Green
Write-Host ""

# Check if Azure CLI is installed
try {
    $azVersion = az version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Azure CLI not found"
    }
    Write-Host "[OK] Azure CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Azure CLI is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Azure CLI from: https://aka.ms/installazurecli" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Checking Azure login status..." -ForegroundColor Cyan

# Check if logged in
$account = az account show 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Not logged in to Azure" -ForegroundColor Red
    Write-Host "Please run: az login" -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Logged in to Azure" -ForegroundColor Green
Write-Host ""

# Update application settings
Write-Host "Updating API keys in Azure Web App..." -ForegroundColor Cyan

try {
    az webapp config appsettings set `
        --name $appName `
        --resource-group $resourceGroup `
        --settings `
            TWELVE_DATA_API_KEY="$twelveDataKey" `
            FINNHUB_API_KEY="$finnhubKey" `
            ALPHA_VANTAGE_API_KEY="$alphaVantageKey" `
        --output none

    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] API keys updated successfully!" -ForegroundColor Green
    } else {
        throw "Failed to update settings"
    }
} catch {
    Write-Host "[ERROR] Failed to update API keys" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Restarting Azure Web App..." -ForegroundColor Cyan

try {
    az webapp restart `
        --name $appName `
        --resource-group $resourceGroup `
        --output none

    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Web App restarted successfully!" -ForegroundColor Green
    } else {
        throw "Failed to restart app"
    }
} catch {
    Write-Host "[ERROR] Failed to restart Web App" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Update Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  [OK] Twelve Data API Key updated" -ForegroundColor White
Write-Host "  [OK] Finnhub API Key updated" -ForegroundColor White
Write-Host "  [OK] Alpha Vantage API Key updated" -ForegroundColor White
Write-Host "  [OK] Web App restarted" -ForegroundColor White
Write-Host ""
Write-Host "Your app is live at:" -ForegroundColor Yellow
Write-Host "  https://aiinsight-fyhyenesh4d2hee9.centralindia-01.azurewebsites.net" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please wait 2-3 minutes for the app to fully restart" -ForegroundColor Yellow
Write-Host ""
