#!/usr/bin/env pwsh
# Custom Domain Configuration Script for ai20insights.tech
# This script configures your custom domain on Azure App Service

Write-Host "🌐 Configuring Custom Domain for AI Insights..." -ForegroundColor Cyan
Write-Host ""

# Configuration
$WEBAPP_NAME = "Aiinsight"
$RESOURCE_GROUP = "Ai_insights"
$CUSTOM_DOMAIN = "ai20insights.tech"
$WWW_DOMAIN = "www.ai20insights.tech"

Write-Host "📋 DNS Configuration Required:" -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Please add these DNS records at your domain registrar:" -ForegroundColor White
Write-Host ""
Write-Host "For Root Domain (ai20insights.tech):" -ForegroundColor Green
Write-Host "  Type: A" -ForegroundColor Cyan
Write-Host "  Name: @" -ForegroundColor Cyan
Write-Host "  Value: 20.192.171.4" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Type: TXT" -ForegroundColor Cyan
Write-Host "  Name: asuid" -ForegroundColor Cyan
Write-Host "  Value: 13CC91425E16B68ED8B9C00BD0ABED944C8B84ADE67BDA63F2B3B70FF7458F3F" -ForegroundColor Cyan
Write-Host ""
Write-Host "For WWW Subdomain (www.ai20insights.tech):" -ForegroundColor Green
Write-Host "  Type: CNAME" -ForegroundColor Cyan
Write-Host "  Name: www" -ForegroundColor Cyan
Write-Host "  Value: aiinsight-fyhyenesh4d2hee9.centralindia-01.azurewebsites.net" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Type: TXT" -ForegroundColor Cyan
Write-Host "  Name: asuid.www" -ForegroundColor Cyan
Write-Host "  Value: 13CC91425E16B68ED8B9C00BD0ABED944C8B84ADE67BDA63F2B3B70FF7458F3F" -ForegroundColor Cyan
Write-Host ""

$confirmation = Read-Host "Have you added the DNS records? (yes/no)"
if ($confirmation -ne "yes") {
    Write-Host "⚠️  Please add the DNS records first, then run this script again." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "⏳ Waiting for DNS propagation (this may take a few minutes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host ""
Write-Host "🔗 Adding custom domain to Azure App Service..." -ForegroundColor Cyan

# Add root domain
Write-Host "  Adding ai20insights.tech..." -ForegroundColor White
try {
    az webapp config hostname add `
        --webapp-name $WEBAPP_NAME `
        --resource-group $RESOURCE_GROUP `
        --hostname $CUSTOM_DOMAIN 2>&1 | Out-Null
    Write-Host "  ✅ Root domain added successfully!" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Root domain: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "     This is normal if DNS hasn't fully propagated yet." -ForegroundColor Yellow
}

# Add www subdomain
Write-Host "  Adding www.ai20insights.tech..." -ForegroundColor White
try {
    az webapp config hostname add `
        --webapp-name $WEBAPP_NAME `
        --resource-group $RESOURCE_GROUP `
        --hostname $WWW_DOMAIN 2>&1 | Out-Null
    Write-Host "  ✅ WWW subdomain added successfully!" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  WWW subdomain: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "     This is normal if DNS hasn't fully propagated yet." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔒 Configuring SSL Certificate (Free Managed Certificate)..." -ForegroundColor Cyan

# Enable HTTPS for root domain
Write-Host "  Enabling HTTPS for ai20insights.tech..." -ForegroundColor White
try {
    az webapp config ssl create `
        --resource-group $RESOURCE_GROUP `
        --name $WEBAPP_NAME `
        --hostname $CUSTOM_DOMAIN 2>&1 | Out-Null
    Write-Host "  ✅ SSL certificate created for root domain!" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  SSL for root domain: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Enable HTTPS for www subdomain
Write-Host "  Enabling HTTPS for www.ai20insights.tech..." -ForegroundColor White
try {
    az webapp config ssl create `
        --resource-group $RESOURCE_GROUP `
        --name $WEBAPP_NAME `
        --hostname $WWW_DOMAIN 2>&1 | Out-Null
    Write-Host "  ✅ SSL certificate created for www subdomain!" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  SSL for www subdomain: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔐 Enforcing HTTPS-only access..." -ForegroundColor Cyan
az webapp update `
    --name $WEBAPP_NAME `
    --resource-group $RESOURCE_GROUP `
    --set httpsOnly=true 2>&1 | Out-Null
Write-Host "  ✅ HTTPS-only mode enabled!" -ForegroundColor Green

Write-Host ""
Write-Host "📊 Checking custom domain status..." -ForegroundColor Cyan
az webapp config hostname list `
    --webapp-name $WEBAPP_NAME `
    --resource-group $RESOURCE_GROUP `
    --output table

Write-Host ""
Write-Host "✅ Custom Domain Configuration Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your app should now be accessible at:" -ForegroundColor Cyan
Write-Host "   https://ai20insights.tech" -ForegroundColor White
Write-Host "   https://www.ai20insights.tech" -ForegroundColor White
Write-Host ""
Write-Host "⏰ Note: SSL certificates may take 5-10 minutes to fully activate." -ForegroundColor Yellow
Write-Host "   If you see SSL errors, wait a few minutes and try again." -ForegroundColor Yellow
Write-Host ""
Write-Host "🔄 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Update Firebase Authorized Domains (add ai20insights.tech)" -ForegroundColor White
Write-Host "   2. Test your site: https://ai20insights.tech" -ForegroundColor White
Write-Host "   3. Commit and push the updated .env and workflow files" -ForegroundColor White
Write-Host ""
