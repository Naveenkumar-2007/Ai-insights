# Manual Azure Deployment Setup Guide

## Step-by-Step Instructions

### 1. Login to Azure Portal
Open: https://portal.azure.com

### 2. Create Resource Group
1. Click "Resource groups" in the left menu
2. Click "+ Create"
3. Fill in:
   - **Subscription**: Your Azure subscription
   - **Resource group**: `ai-insights-rg`
   - **Region**: East US
4. Click "Review + create" then "Create"

### 3. Create App Service Plan
1. Search for "App Service plans" in the top search bar
2. Click "+ Create"
3. Fill in:
   - **Resource Group**: `ai-insights-rg`
   - **Name**: `ai-insights-plan`
   - **Operating System**: Linux
   - **Region**: East US
   - **Pricing tier**: B1 (Basic)
4. Click "Review + create" then "Create"

### 4. Create Web App
1. Search for "App Services" in the top search bar
2. Click "+ Create" > "Web App"
3. Fill in:
   - **Resource Group**: `ai-insights-rg`
   - **Name**: `ai-insights-app` (must be globally unique)
   - **Publish**: Code
   - **Runtime stack**: Python 3.12
   - **Operating System**: Linux
   - **Region**: East US
   - **App Service Plan**: `ai-insights-plan`
4. Click "Review + create" then "Create"
5. Wait for deployment to complete

### 5. Configure Web App Startup
1. Go to your Web App: `ai-insights-app`
2. In the left menu, click "Configuration"
3. Click "General settings" tab
4. In "Startup Command" enter:
   ```
   gunicorn --bind=0.0.0.0 --timeout 600 wsgi:app
   ```
5. Click "Save"

### 6. Create Service Principal for GitHub
1. Open Azure Cloud Shell (click the terminal icon in top-right)
2. Run these commands:

```bash
# Get your subscription ID
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

# Create service principal
az ad sp create-for-rbac \
  --name "github-ai-insights-deploy" \
  --role contributor \
  --scopes "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/ai-insights-rg" \
  --sdk-auth
```

3. **COPY THE ENTIRE JSON OUTPUT** - you'll need it for GitHub secrets

### 7. Configure GitHub Secrets

Go to: https://github.com/Naveenkumar-2007/Ai-insights/settings/secrets/actions

Click "New repository secret" and add each of these:

#### Required Secrets:

| Secret Name | Value | Where to get it |
|------------|-------|-----------------|
| `AZURE_CREDENTIALS` | JSON from step 6 | Copy entire JSON output |
| `AZURE_RESOURCE_GROUP` | `ai-insights-rg` | Your resource group name |
| `TWELVE_DATA_API_KEY` | Your API key | https://twelvedata.com/account |
| `FINNHUB_API_KEY` | Your API key (or "demo") | https://finnhub.io/ |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Entire JSON | Your firebase-admin file content |
| `ADMIN_EMAILS` | `naveenkumarchapala123@gmail.com` | Comma-separated admin emails |
| `ALLOWED_ORIGINS` | `https://ai-insights-app.azurewebsites.net` | Your Azure web app URL |
| `REACT_APP_API_URL` | `https://ai-insights-app.azurewebsites.net` | Your Azure web app URL |

#### Firebase Secrets (from Firebase Console):

| Secret Name | Where to find |
|------------|---------------|
| `REACT_APP_FIREBASE_API_KEY` | Project Settings > General |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Project Settings > General |
| `REACT_APP_FIREBASE_PROJECT_ID` | Project Settings > General |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Project Settings > General |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Project Settings > General |
| `REACT_APP_FIREBASE_APP_ID` | Project Settings > General |
| `REACT_APP_FIREBASE_MEASUREMENT_ID` | Project Settings > General (optional) |
| `REACT_APP_ADMIN_EMAILS` | `naveenkumarchapala123@gmail.com` |

### 8. Update Firebase Authorized Domains

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: `ai-stock-predictor-2136d`
3. Go to **Authentication** > **Settings** > **Authorized domains**
4. Click "Add domain"
5. Add: `ai-insights-app.azurewebsites.net`
6. Click "Add"

### 9. Deploy via GitHub Actions

1. Commit and push any change:
   ```bash
   git add .
   git commit -m "Trigger deployment"
   git push origin main
   ```

2. Or manually trigger:
   - Go to: https://github.com/Naveenkumar-2007/Ai-insights/actions
   - Click "Build and Deploy to Azure"
   - Click "Run workflow"
   - Select "main" branch
   - Click "Run workflow"

### 10. Verify Deployment

1. Wait for GitHub Actions to complete (5-10 minutes)
2. Open: https://ai-insights-app.azurewebsites.net
3. Test:
   - Homepage loads
   - Can register/login
   - Stock search works
   - Charts display

## Troubleshooting

### Issue: Web app name already taken
**Solution**: Choose a different name (must be globally unique)
- Try: `ai-insights-naveen`, `aiinsights2024`, etc.
- Update `ALLOWED_ORIGINS` and `REACT_APP_API_URL` secrets with new URL

### Issue: GitHub Actions fails with authentication error
**Solution**: 
- Verify `AZURE_CREDENTIALS` secret is correct (entire JSON from step 6)
- Ensure service principal has "Contributor" role
- Check resource group name matches

### Issue: Application doesn't start
**Solution**:
1. Go to Azure Portal > Your Web App > "Log stream"
2. Check for errors
3. Verify all environment variables are set correctly
4. Ensure startup command is correct

### Issue: Firebase authentication fails
**Solution**:
- Verify Firebase authorized domains includes your Azure URL
- Check all `REACT_APP_FIREBASE_*` secrets are correct
- Ensure `FIREBASE_SERVICE_ACCOUNT_JSON` is complete

## Cost Information

- **App Service Plan B1**: ~$13/month
- **Free tier available** for testing (limited hours)

To use free tier:
1. Go to your App Service Plan
2. Click "Scale up (App Service plan)"
3. Select "F1 (Free)" tier

## Next Steps

After successful deployment:
1. ✅ Test all features
2. ✅ Configure custom domain (optional)
3. ✅ Enable Application Insights for monitoring
4. ✅ Set up auto-scaling (if needed)
5. ✅ Configure backup strategy

---

**Your app will be live at**: https://ai-insights-app.azurewebsites.net

For support, check:
- GitHub Actions logs
- Azure Log Stream
- `DEPLOYMENT.md` for detailed instructions
