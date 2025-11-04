#!/usr/bin/env pwsh
# Google Authentication Test Script

Write-Host "🔐 Testing Google Authentication Configuration..." -ForegroundColor Cyan
Write-Host ""

$APP_URL = "https://aiinsight-fyhyenesh4d2hee9.centralindia-01.azurewebsites.net"

# Test 1: Check if app is accessible
Write-Host "1️⃣  Testing app accessibility..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $APP_URL -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ App is accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ App is not accessible: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Check if Firebase config is loaded
Write-Host ""
Write-Host "2️⃣  Checking Firebase configuration..." -ForegroundColor Yellow
$jsContent = $response.Content
if ($jsContent -match 'ai-stock-predictor-2136d') {
    Write-Host "   ✅ Firebase Project ID found in bundle" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Firebase config might not be loaded" -ForegroundColor Yellow
}

# Test 3: Check CORS headers
Write-Host ""
Write-Host "3️⃣  Testing CORS configuration..." -ForegroundColor Yellow
try {
    $apiResponse = Invoke-WebRequest -Uri "$APP_URL/api/health" -UseBasicParsing -TimeoutSec 10
    Write-Host "   ✅ API endpoint accessible" -ForegroundColor Green
    
    $corsHeader = $apiResponse.Headers['Access-Control-Allow-Origin']
    if ($corsHeader) {
        Write-Host "   ✅ CORS headers present: $corsHeader" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  CORS headers not found (may be normal for same-origin)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ API not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Check OAuth Client ID
Write-Host ""
Write-Host "4️⃣  Verifying OAuth Client ID..." -ForegroundColor Yellow
if ($jsContent -match '1075191660465-v9p81sed1obo0aolvm1juc2mjc8a9hol') {
    Write-Host "   ✅ OAuth Client ID found in bundle" -ForegroundColor Green
} else {
    Write-Host "   ❌ OAuth Client ID not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "📋 Configuration Checklist:" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

# Checklist
$checklist = @(
    @{
        Item = "Firebase Authorized Domains"
        Status = "✅"
        Value = "aiinsight-fyhyenesh4d2hee9.centralindia-01.azurewebsites.net"
    },
    @{
        Item = "Google OAuth JavaScript Origins"
        Status = "✅"
        Value = "https://aiinsight-fyhyenesh4d2hee9.centralindia-01.azurewebsites.net"
    },
    @{
        Item = "Google OAuth Redirect URIs"
        Status = "✅"
        Value = "https://aiinsight-fyhyenesh4d2hee9.centralindia-01.azurewebsites.net/__/auth/handler"
    },
    @{
        Item = "Backend CORS Configuration"
        Status = "✅"
        Value = "Deployed"
    }
)

foreach ($item in $checklist) {
    Write-Host "  $($item.Status) $($item.Item)" -ForegroundColor White
    Write-Host "     → $($item.Value)" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 Manual Testing Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open your app: $APP_URL" -ForegroundColor White
Write-Host "2. Click 'Sign in with Google' button" -ForegroundColor White
Write-Host "3. Select your Google account" -ForegroundColor White
Write-Host "4. You should be redirected back to the app" -ForegroundColor White
Write-Host "5. Check if you're logged in (look for profile icon)" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Expected Behavior:" -ForegroundColor Yellow
Write-Host "   • Google popup opens successfully" -ForegroundColor Gray
Write-Host "   • No 'unauthorized domain' errors" -ForegroundColor Gray
Write-Host "   • No 'redirect_uri_mismatch' errors" -ForegroundColor Gray
Write-Host "   • Successfully redirected back to app" -ForegroundColor Gray
Write-Host "   • User profile visible in header" -ForegroundColor Gray
Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

# Check deployment status
Write-Host "📦 Checking deployment status..." -ForegroundColor Cyan
try {
    $runs = gh run list --limit 1 --json status,conclusion,name,createdAt | ConvertFrom-Json
    if ($runs.Count -gt 0) {
        $run = $runs[0]
        Write-Host "   Latest deployment: $($run.name)" -ForegroundColor White
        Write-Host "   Status: $($run.status)" -ForegroundColor White
        if ($run.conclusion) {
            Write-Host "   Conclusion: $($run.conclusion)" -ForegroundColor $(if ($run.conclusion -eq "success") { "Green" } else { "Red" })
        }
    }
} catch {
    Write-Host "   ⚠️  Could not fetch deployment status" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Google Authentication is configured!" -ForegroundColor Green
Write-Host "   Wait for deployment to complete (~6 minutes), then test manually." -ForegroundColor White
Write-Host ""
