#!/bin/bash
# Azure Quick Setup Script - Run this in Azure Cloud Shell
# This creates all resources and outputs the GitHub secrets you need

set -e

echo "============================================"
echo "AI Insights - Azure Quick Setup"
echo "============================================"
echo ""

# Variables
RESOURCE_GROUP="ai-insights-rg"
LOCATION="eastus"
APP_SERVICE_PLAN="ai-insights-plan"
WEB_APP_NAME="ai-insights-app"

echo "Creating Resource Group..."
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION \
  --output none

echo "✓ Resource Group created"

echo "Creating App Service Plan (B1 tier)..."
az appservice plan create \
  --name $APP_SERVICE_PLAN \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku B1 \
  --is-linux \
  --output none

echo "✓ App Service Plan created"

echo "Creating Web App (Python 3.12)..."
az webapp create \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --runtime "PYTHON:3.12" \
  --output none

echo "✓ Web App created"

echo "Configuring startup command..."
az webapp config set \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --startup-file "gunicorn --bind=0.0.0.0 --timeout 600 wsgi:app" \
  --output none

echo "✓ Startup configured"

echo "Creating Service Principal for GitHub Actions..."
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
SP_OUTPUT=$(az ad sp create-for-rbac \
  --name "github-ai-insights-deploy" \
  --role contributor \
  --scopes "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP" \
  --sdk-auth)

echo "✓ Service Principal created"
echo ""
echo "============================================"
echo "SETUP COMPLETE!"
echo "============================================"
echo ""
echo "Your Web App URL: https://$WEB_APP_NAME.azurewebsites.net"
echo ""
echo "============================================"
echo "COPY THESE GITHUB SECRETS:"
echo "============================================"
echo ""
echo "Go to: https://github.com/Naveenkumar-2007/Ai-insights/settings/secrets/actions"
echo ""
echo "1. AZURE_CREDENTIALS"
echo "----------------------------------------"
echo "$SP_OUTPUT"
echo ""
echo "2. AZURE_RESOURCE_GROUP"
echo "----------------------------------------"
echo "$RESOURCE_GROUP"
echo ""
echo "3. REACT_APP_API_URL"
echo "----------------------------------------"
echo "https://$WEB_APP_NAME.azurewebsites.net"
echo ""
echo "4. ALLOWED_ORIGINS"
echo "----------------------------------------"
echo "https://$WEB_APP_NAME.azurewebsites.net"
echo ""
echo "============================================"
echo "NEXT: Add all secrets to GitHub, then push to deploy!"
echo "============================================"
