# 🚀 Quick Start: Custom Domain Setup

## 📋 DNS Records to Add (Copy & Paste)

### At your domain registrar for **ai20insights.tech**:

**A Record (Root Domain):**
```
Type: A
Host: @ (or blank)
Points to: 20.192.171.4
TTL: 3600
```

**TXT Record (Verification):**
```
Type: TXT
Host: asuid
Value: 13CC91425E16B68ED8B9C00BD0ABED944C8B84ADE67BDA63F2B3B70FF7458F3F
TTL: 3600
```

**CNAME Record (WWW):**
```
Type: CNAME
Host: www
Points to: aiinsight-fyhyenesh4d2hee9.centralindia-01.azurewebsites.net
TTL: 3600
```

**TXT Record (WWW Verification):**
```
Type: TXT
Host: asuid.www
Value: 13CC91425E16B68ED8B9C00BD0ABED944C8B84ADE67BDA63F2B3B70FF7458F3F
TTL: 3600
```

---

## ⏰ After Adding DNS Records:

1. **Wait 15-30 minutes** for DNS propagation
2. **Check DNS**: https://dnschecker.org/#A/ai20insights.tech
3. **Run setup script**:
   ```powershell
   .\configure-custom-domain.ps1
   ```
4. **Update Firebase**: Add `ai20insights.tech` to Authorized Domains
5. **Wait for deployment**: ~6 minutes
6. **Visit**: https://ai20insights.tech 🎉

---

## 🔗 Useful Links:

- **DNS Checker**: https://dnschecker.org
- **Firebase Console**: https://console.firebase.google.com
- **Azure Portal**: https://portal.azure.com
- **GitHub Actions**: https://github.com/Naveenkumar-2007/Ai-insights/actions

---

**Need help? Check CUSTOM-DOMAIN-SETUP.md for detailed instructions.**
