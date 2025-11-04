# 🌐 Custom Domain Setup Guide for ai20insights.tech

## ✅ What's Been Done

1. ✅ Updated frontend `.env` with custom domain
2. ✅ Updated GitHub Actions workflow with custom domain
3. ✅ Committed and pushed changes
4. ✅ Created automated setup script

## 📋 DNS Configuration Steps

### Step 1: Add DNS Records at Your Domain Registrar

Go to your domain registrar (where you bought ai20insights.tech) and add these records:

#### **For Root Domain (ai20insights.tech):**

```
Type: A Record
Name/Host: @ (or leave blank)
Value/Points to: 20.192.171.4
TTL: 3600 (or Auto)
```

```
Type: TXT Record
Name/Host: asuid
Value: 13CC91425E16B68ED8B9C00BD0ABED944C8B84ADE67BDA63F2B3B70FF7458F3F
TTL: 3600 (or Auto)
```

#### **For WWW Subdomain (www.ai20insights.tech):**

```
Type: CNAME Record
Name/Host: www
Value/Points to: aiinsight-fyhyenesh4d2hee9.centralindia-01.azurewebsites.net
TTL: 3600 (or Auto)
```

```
Type: TXT Record
Name/Host: asuid.www
Value: 13CC91425E16B68ED8B9C00BD0ABED944C8B84ADE67BDA63F2B3B70FF7458F3F
TTL: 3600 (or Auto)
```

### Step 2: Wait for DNS Propagation (15-30 minutes)

Check DNS propagation status:
- https://dnschecker.org/#A/ai20insights.tech
- https://dnschecker.org/#CNAME/www.ai20insights.tech

### Step 3: Run the Configuration Script

Once DNS records are added and propagated:

```powershell
# Run the automated configuration script
.\configure-custom-domain.ps1
```

This script will:
- ✅ Verify DNS records are set up correctly
- ✅ Add custom domain to Azure App Service
- ✅ Create free SSL certificates (HTTPS)
- ✅ Enable HTTPS-only access
- ✅ Configure both root and www domains

### Step 4: Update Firebase Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **ai-stock-predictor-2136d**
3. Go to **Authentication** → **Settings** → **Authorized Domains**
4. Click **Add Domain**
5. Add: `ai20insights.tech`
6. Click **Add**

### Step 5: Test Your Custom Domain

After deployment completes (in ~6 minutes), visit:
- https://ai20insights.tech
- https://www.ai20insights.tech

Both should work with HTTPS! 🔒

## 🔄 Deployment Timeline

1. **Now:** DNS configuration (you need to add records)
2. **15-30 min:** DNS propagation
3. **After DNS:** Run `configure-custom-domain.ps1`
4. **5-10 min:** SSL certificate activation
5. **After script:** Push triggers new deployment with custom domain
6. **6 min:** Deployment completes
7. **Done!** Your app is live at https://ai20insights.tech

## 🚀 Next Deployment

The GitHub Actions workflow will now build the app with your custom domain. When the current deployment finishes:

```bash
# Check deployment status
gh run list --limit 1
```

Your app will be accessible at **https://ai20insights.tech**!

## 🔍 Troubleshooting

### If custom domain doesn't work:
```powershell
# Check DNS records
nslookup ai20insights.tech
nslookup www.ai20insights.tech

# Check Azure custom domains
az webapp config hostname list --webapp-name Aiinsight --resource-group Ai_insights --output table

# Check SSL certificates
az webapp config ssl list --resource-group Ai_insights --output table
```

### Common Issues:

1. **DNS not propagated yet**: Wait 30 minutes and try again
2. **SSL certificate pending**: Wait 5-10 minutes for activation
3. **404 error**: DNS records incorrect - verify A and CNAME records
4. **Mixed content warnings**: All resources must use HTTPS

## 📞 Support

If you need help:
1. Check DNS propagation at dnschecker.org
2. Verify all DNS records are correct
3. Wait for SSL activation (up to 10 minutes)
4. Clear browser cache and try again

---

**Your custom domain is ready to go! Just add the DNS records and run the script.** 🎉
