# Azure Deployment Guide for AI Insights

## Prerequisites Checklist

- ✅ Azure account with active subscription
- ✅ Azure CLI installed
- ✅ GitHub account
- ✅ Firebase project configured
- ✅ Twelve Data API key
- ✅ Code pushed to GitHub: https://github.com/Naveenkumar-2007/Ai-insights

## Step 1: Create Azure Resources

### 1.1 Login to Azure CLI

```powershell
az login
```

### 1.2 Create Resource Group

```powershell
az group create `
  --name ai-insights-rg `
  --location eastus
```

### 1.3 Create App Service Plan

```powershell
az appservice plan create `
  --name ai-insights-plan `
  --resource-group ai-insights-rg `
  --sku B1 `
  --is-linux
```

### 1.4 Create Web App

```powershell
az webapp create `
  --name ai-insights-app `
  --resource-group ai-insights-rg `
  --plan ai-insights-plan `
  --runtime "PYTHON:3.12"
```

### 1.5 Download Publish Profile

Go to Azure Portal:
1. Navigate to your Web App: `ai-insights-app`
2. Click **Download publish profile**
3. Save the `.PublishSettings` file

## Step 2: Configure GitHub Secrets

Go to: https://github.com/Naveenkumar-2007/Ai-insights/settings/secrets/actions

Click **New repository secret** and add each of these:

### Backend Environment Secrets

| Secret Name | Value | Example |
|------------|-------|---------|
| `AZURE_WEBAPP_PUBLISH_PROFILE` | Contents of .PublishSettings file | (XML content) |
| `TWELVE_DATA_API_KEY` | Your Twelve Data API key | `abc123xyz...` |
| `FINNHUB_API_KEY` | Your Finnhub API key | `def456uvw...` |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Entire Firebase service account JSON | `{"type":"service_account",...}` |
| `ADMIN_EMAILS` | Comma-separated admin emails | `naveenkumarchapala123@gmail.com` |
| `ALLOWED_ORIGINS` | Production URL | `https://ai-insights-app.azurewebsites.net` |
| `AZURE_RESOURCE_GROUP` | Resource group name | `ai-insights-rg` |

### Frontend Environment Secrets

| Secret Name | Value | Source |
|------------|-------|--------|
| `REACT_APP_API_URL` | `https://ai-insights-app.azurewebsites.net` | Your Azure app URL |
| `REACT_APP_FIREBASE_API_KEY` | From Firebase Console | Project Settings → General |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` | Firebase Console |
| `REACT_APP_FIREBASE_PROJECT_ID` | Your project ID | Firebase Console |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` | Firebase Console |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Sender ID | Firebase Console |
| `REACT_APP_FIREBASE_APP_ID` | App ID | Firebase Console |
| `REACT_APP_FIREBASE_MEASUREMENT_ID` | Measurement ID (optional) | Firebase Console |
| `REACT_APP_ADMIN_EMAILS` | Same as ADMIN_EMAILS | `naveenkumarchapala123@gmail.com` |

## Step 3: Configure Firebase

### 3.1 Update Firebase Authentication

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: `ai-stock-predictor-2136d`
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Azure domain: `ai-insights-app.azurewebsites.net`

### 3.2 CORS Configuration

Already configured in the backend to use `ALLOWED_ORIGINS` environment variable.

## Step 4: Deploy via GitHub Actions

### Automatic Deployment

1. Push any changes to the `main` branch:

```powershell
git add .
git commit -m "Deploy to Azure"
git push origin main
```

2. GitHub Actions will automatically:
   - Build React frontend with environment variables
   - Install Python dependencies
   - Copy frontend build to Flask static folder
   - Deploy to Azure Web App
   - Configure all environment variables

### Manual Trigger

Go to: https://github.com/Naveenkumar-2007/Ai-insights/actions

1. Click on **Build and Deploy to Azure** workflow
2. Click **Run workflow**
3. Select `main` branch
4. Click **Run workflow**

## Step 5: Verify Deployment

### 5.1 Check Deployment Status

```powershell
az webapp show `
  --name ai-insights-app `
  --resource-group ai-insights-rg `
  --query "state"
```

Should return: `"Running"`

### 5.2 View Application Logs

```powershell
az webapp log tail `
  --name ai-insights-app `
  --resource-group ai-insights-rg
```

### 5.3 Test Application

Open browser: https://ai-insights-app.azurewebsites.net

**Test checklist:**
- ✅ Homepage loads
- ✅ Can register/login with Firebase
- ✅ Stock search works
- ✅ Charts display correctly
- ✅ Admin user can see admin features

## Step 6: Configure Custom Domain (Optional)

### 6.1 Add Custom Domain

```powershell
az webapp config hostname add `
  --webapp-name ai-insights-app `
  --resource-group ai-insights-rg `
  --hostname yourdomain.com
```

### 6.2 Enable HTTPS

```powershell
az webapp config ssl bind `
  --certificate-thumbprint <thumbprint> `
  --ssl-type SNI `
  --name ai-insights-app `
  --resource-group ai-insights-rg
```

### 6.3 Update Secrets

Update these GitHub secrets with your custom domain:
- `ALLOWED_ORIGINS`: `https://yourdomain.com`
- `REACT_APP_API_URL`: `https://yourdomain.com`

And redeploy.

## Step 7: Monitoring & Scaling

### 7.1 Enable Application Insights

```powershell
az monitor app-insights component create `
  --app ai-insights-insights `
  --location eastus `
  --resource-group ai-insights-rg `
  --application-type web
```

### 7.2 Configure Auto-scaling

```powershell
az monitor autoscale create `
  --resource-group ai-insights-rg `
  --resource ai-insights-app `
  --resource-type Microsoft.Web/sites `
  --name autoscale-ai-insights `
  --min-count 1 `
  --max-count 3 `
  --count 1
```

### 7.3 Set Up Alerts

Go to Azure Portal:
1. Navigate to your Web App
2. Click **Alerts** → **New alert rule**
3. Configure alerts for:
   - High CPU usage (>80%)
   - High memory usage (>80%)
   - HTTP 500 errors
   - Response time (>3s)

## Troubleshooting

### Issue: Deployment fails

**Solution:**
1. Check GitHub Actions logs
2. Verify all secrets are correctly set
3. Ensure Azure resource names are unique

### Issue: Application won't start

**Solution:**
```powershell
# Check logs
az webapp log tail --name ai-insights-app --resource-group ai-insights-rg

# Restart app
az webapp restart --name ai-insights-app --resource-group ai-insights-rg
```

### Issue: Firebase authentication fails

**Solution:**
1. Verify Firebase service account JSON is correct in GitHub secrets
2. Check `ALLOWED_ORIGINS` includes your Azure domain
3. Ensure Firebase authorized domains includes Azure domain

### Issue: API calls fail

**Solution:**
1. Verify `TWELVE_DATA_API_KEY` is set correctly
2. Check API quotas aren't exceeded
3. Review application logs for specific errors

## Cost Optimization

### Current Configuration
- App Service Plan: B1 (~$13/month)
- Storage: Minimal cost
- Application Insights: Free tier

### Optimization Tips
1. Use **F1 (Free)** tier for development/testing
2. Enable **auto-pause** for dev environments
3. Use **CDN** for static assets in production
4. Monitor and optimize database queries
5. Cache frequently accessed data

## Security Checklist

- ✅ Environment variables stored as secrets
- ✅ Firebase service account not in repository
- ✅ CORS configured with specific origins
- ✅ HTTPS enabled (Azure provides free SSL)
- ✅ Admin roles properly configured
- ✅ API keys secured in environment
- ✅ Logging enabled for security monitoring

## Maintenance

### Update Dependencies

```powershell
# Backend
cd VIONEX-finance-Ai-Stock-price-predictor-main
pip list --outdated
pip install --upgrade package-name

# Frontend
cd frontend
npm outdated
npm update
```

### Backup Strategy

1. Enable Azure App Service backup:
   - Settings → Backups → Configure
   - Set frequency and retention

2. Repository is backed up on GitHub

### Monitoring Dashboard

Access at: https://portal.azure.com
- Navigate to your Web App
- View metrics: CPU, Memory, Response Time, Requests
- Set up custom dashboards for key metrics

## Support & Resources

- **Azure Documentation**: https://docs.microsoft.com/azure
- **Firebase Documentation**: https://firebase.google.com/docs
- **GitHub Actions**: https://docs.github.com/actions
- **Project Repository**: https://github.com/Naveenkumar-2007/Ai-insights

## Next Steps

1. ✅ Set up continuous monitoring
2. ✅ Configure backup strategy
3. ✅ Add custom domain (optional)
4. ✅ Enable CDN for better performance
5. ✅ Set up staging environment
6. ✅ Implement A/B testing (optional)

---

**Deployment completed!** Your application is now live at:
https://ai-insights-app.azurewebsites.net

For any issues, check GitHub Actions logs or Azure App Service logs.
