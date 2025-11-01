# Azure Configuration Script for Fintrix AI Stock Predictor
# Run this script to configure environment variables in Azure App Service

Write-Host "=== Azure App Service Configuration ===" -ForegroundColor Cyan
Write-Host ""

# App Service Details
$webAppName = "fintrix-ai-stock-price-predictor"

# Step 1: Find the resource group
Write-Host "Step 1: Finding resource group..." -ForegroundColor Yellow
az webapp list --query "[?name=='$webAppName'].{Name:name, ResourceGroup:resourceGroup}" --output table

Write-Host ""
Write-Host "Please enter your Resource Group name from the table above:" -ForegroundColor Green
$resourceGroup = Read-Host "Resource Group"

if ([string]::IsNullOrWhiteSpace($resourceGroup)) {
    Write-Host "ERROR: Resource group name is required!" -ForegroundColor Red
    exit 1
}

# Step 2: Load environment variables from .env
Write-Host ""
Write-Host "Step 2: Loading API keys from .env file..." -ForegroundColor Yellow

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Definition
$possibleEnvPaths = @(
    Join-Path $scriptDirectory ".env",
    Join-Path (Split-Path $scriptDirectory -Parent) ".env"
)

$envFilePath = $possibleEnvPaths | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $envFilePath) {
    Write-Host "ERROR: .env file not found. Please create a .env file before running this script." -ForegroundColor Red
    exit 1
}

$envVariables = @{}
Get-Content $envFilePath | ForEach-Object {
    $line = $_.Trim()
    if ([string]::IsNullOrWhiteSpace($line) -or $line.StartsWith('#')) {
        return
    }

    $separatorIndex = $line.IndexOf('=')
    if ($separatorIndex -lt 1) {
        return
    }

    $key = $line.Substring(0, $separatorIndex).Trim()
    $value = $line.Substring($separatorIndex + 1).Trim().Trim('"')
    $envVariables[$key] = $value
}

$requiredKeys = @('TWELVE_DATA_API_KEY', 'FINNHUB_API_KEY')
foreach ($requiredKey in $requiredKeys) {
    if (-not $envVariables.ContainsKey($requiredKey) -or [string]::IsNullOrWhiteSpace($envVariables[$requiredKey])) {
        $envVariables[$requiredKey] = Read-Host -Prompt "Enter value for $requiredKey"
        if ([string]::IsNullOrWhiteSpace($envVariables[$requiredKey])) {
            Write-Host "ERROR: $requiredKey is required." -ForegroundColor Red
            exit 1
        }
    }
}

$settings = @{}
foreach ($requiredKey in $requiredKeys) {
    $settings[$requiredKey] = $envVariables[$requiredKey]
}

# Convert to Azure CLI format without exposing keys in the console
$settingsString = ($settings.GetEnumerator() | ForEach-Object { "$($_.Key)=`"$($_.Value)`"" }) -join ' '

Write-Host "Executing: az webapp config appsettings set..." -ForegroundColor Gray
$command = "az webapp config appsettings set --name $webAppName --resource-group $resourceGroup --settings $settingsString"
Invoke-Expression $command

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ SUCCESS! API keys configured successfully." -ForegroundColor Green
    Write-Host ""
    Write-Host "Step 3: Restarting web app to apply changes..." -ForegroundColor Yellow
    az webapp restart --name $webAppName --resource-group $resourceGroup
    
    Write-Host ""
    Write-Host "✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
    Write-Host "Your app is now available at:" -ForegroundColor Cyan
    Write-Host "https://$webAppName.centralindia-01.azurewebsites.net/" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ ERROR: Failed to configure settings. Please check your Azure CLI authentication." -ForegroundColor Red
    Write-Host "Run 'az login' to authenticate first." -ForegroundColor Yellow
}
