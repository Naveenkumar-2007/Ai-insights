# Quick Deployment Checklist

## ✅ Completed
- [x] Rebranded to AI Insights
- [x] Fixed GitHub Actions workflow
- [x] Added package-lock.json for npm caching
- [x] Created Azure deployment automation
- [x] Pushed code to GitHub

## 📋 Your Next Steps

### 1. Create Azure Resources (5 minutes)
**Follow**: `AZURE_MANUAL_SETUP.md` steps 1-6

Quick Azure Portal links:
- Create Resource Group: https://portal.azure.com/#create/Microsoft.ResourceGroup
- Create App Service: https://portal.azure.com/#create/Microsoft.WebSite

**Resources to create:**
- Resource Group: `ai-insights-rg`
- App Service Plan: `ai-insights-plan` (B1 tier, Linux)
- Web App: `ai-insights-app` (Python 3.12)

### 2. Get Service Principal (1 minute)
Open Azure Cloud Shell and run:
```bash
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
az ad sp create-for-rbac \
  --name "github-ai-insights-deploy" \
  --role contributor \
  --scopes "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/ai-insights-rg" \
  --sdk-auth
```
**Copy the entire JSON output!**

### 3. Add GitHub Secrets (3 minutes)
Go to: https://github.com/Naveenkumar-2007/Ai-insights/settings/secrets/actions

**Must add** (11 secrets):

```
AZURE_CREDENTIALS                      → JSON from step 2
AZURE_RESOURCE_GROUP                   → ai-insights-rg
TWELVE_DATA_API_KEY                    → demo (or real key)
FINNHUB_API_KEY                        → demo (or real key)
FIREBASE_SERVICE_ACCOUNT_JSON          → Your firebase-admin.json content
ADMIN_EMAILS                           → naveenkumarchapala123@gmail.com
ALLOWED_ORIGINS                        → https://ai-insights-app.azurewebsites.net
REACT_APP_API_URL                      → https://ai-insights-app.azurewebsites.net
REACT_APP_FIREBASE_API_KEY             → From Firebase Console
REACT_APP_FIREBASE_AUTH_DOMAIN         → From Firebase Console
REACT_APP_FIREBASE_PROJECT_ID          → ai-stock-predictor-2136d
```

Plus 5 more Firebase secrets (see `AZURE_MANUAL_SETUP.md` for full list)

### 4. Update Firebase (1 minute)
Firebase Console → Authentication → Settings → Authorized domains
Add: `ai-insights-app.azurewebsites.net`

### 5. Deploy! (1 click)
**Option A**: Push any change
```bash
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

**Option B**: Manual trigger
https://github.com/Naveenkumar-2007/Ai-insights/actions

Click "Build and Deploy to Azure" → "Run workflow"

### 6. Wait & Verify (10 minutes)
- Watch GitHub Actions: https://github.com/Naveenkumar-2007/Ai-insights/actions
- Once complete, visit: https://ai-insights-app.azurewebsites.net
- Test login/stock search

## 🆘 Quick Fixes

**If deployment fails:**
1. Check GitHub Actions logs
2. Verify all secrets are set correctly
3. Ensure Azure resources were created
4. Check `AZURE_MANUAL_SETUP.md` troubleshooting section

**If app doesn't start:**
- Azure Portal → Your Web App → "Log stream"
- Look for Python/startup errors

**If login doesn't work:**
- Verify Firebase authorized domains
- Check all REACT_APP_FIREBASE_* secrets

## 📚 Documentation
- Full guide: `AZURE_MANUAL_SETUP.md`
- Detailed deployment: `DEPLOYMENT.md`
- Project readme: `README.md`

## 🎉 Success!
Your app will be live at: **https://ai-insights-app.azurewebsites.net**

---

Estimated total time: **15-20 minutes**
