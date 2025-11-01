# Azure Setup Script for AI Insights Deployment
# Run this in PowerShell with Azure CLI installed

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "AI Insights - Azure Deployment Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

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

Write-Host "[1/7] Logging into Azure..." -ForegroundColor Green
az login
if ($LASTEXITCODE -ne 0) {
    Write-Host "Azure login failed" -ForegroundColor Red
    exit 1
}
Write-Host "Successfully logged in" -ForegroundColor Green
Write-Host ""

Write-Host "[2/7] Creating Resource Group..." -ForegroundColor Green
az group create --name $RESOURCE_GROUP --location $LOCATION
Write-Host ""

Write-Host "[3/7] Creating App Service Plan..." -ForegroundColor Green
az appservice plan create --name $APP_SERVICE_PLAN --resource-group $RESOURCE_GROUP --location $LOCATION --sku B1 --is-linux
Write-Host ""

Write-Host "[4/7] Creating Web App..." -ForegroundColor Green
az webapp create --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP --plan $APP_SERVICE_PLAN --runtime "PYTHON:$PYTHON_VERSION"
Write-Host ""

Write-Host "[5/7] Configuring Web App startup..." -ForegroundColor Green
az webapp config set --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP --startup-file "gunicorn --bind=0.0.0.0 --timeout 600 wsgi:app"
Write-Host ""

Write-Host "[6/7] Creating Service Principal..." -ForegroundColor Green
$subscriptionId = az account show --query id -o tsv
$scope = "/subscriptions/$subscriptionId/resourceGroups/$RESOURCE_GROUP"
$spOutput = az ad sp create-for-rbac --name "github-ai-insights-deploy" --role contributor --scopes $scope --sdk-auth
Write-Host ""

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "DEPLOYMENT INFORMATION" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Web App URL: https://$WEB_APP_NAME.azurewebsites.net" -ForegroundColor Yellow
Write-Host ""
Write-Host "GitHub Secrets to add:" -ForegroundColor Cyan
Write-Host "https://github.com/Naveenkumar-2007/Ai-insights/settings/secrets/actions"
Write-Host ""
Write-Host "AZURE_CREDENTIALS:" -ForegroundColor Yellow
Write-Host $spOutput
Write-Host ""
Write-Host "AZURE_RESOURCE_GROUP: $RESOURCE_GROUP" -ForegroundColor Yellow
Write-Host "REACT_APP_API_URL: https://$WEB_APP_NAME.azurewebsites.net" -ForegroundColor Yellow
Write-Host "ALLOWED_ORIGINS: https://$WEB_APP_NAME.azurewebsites.net" -ForegroundColor Yellow
Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
