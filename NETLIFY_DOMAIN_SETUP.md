# 🌐 Netlify Custom Domain Setup Guide

Complete guide to connect your custom domain `tadabburtours.com` to your Netlify site.

---

## 📋 Step 1: Add Domain to Netlify

### 1.1 Go to Domain Settings

1. Go to **[Netlify Dashboard](https://app.netlify.com)**
2. Click on your site **"tadabbur-tours"** (or your site name)
3. Click **"Domain settings"** in the left sidebar
   - Or go to: **Site settings** → **Domain management**

### 1.2 Add Custom Domain

1. Click **"Add custom domain"** button
2. Enter your domain: `tadabburtours.com`
3. Click **"Verify"** or **"Add domain"**

**Note:** Also add `www.tadabburtours.com` if you want www version to work.

---

## 🔧 Step 2: Configure DNS Records

Netlify will show you what DNS records to add. You need to add these records at your **domain registrar** (where you bought the domain).

### Option A: Use Netlify DNS (Easiest)

**Recommended if you want Netlify to manage everything:**

1. In Netlify Domain settings, click on your domain
2. Click **"Set up Netlify DNS"**
3. Netlify will provide nameservers (e.g., `dns1.p01.nsone.net`)
4. Go to your domain registrar (where you bought the domain)
5. Update nameservers to Netlify's nameservers

**Where to update nameservers:**
- Go to your domain registrar (GoDaddy, Namecheap, Google Domains, etc.)
- Find **"DNS Settings"** or **"Nameservers"**
- Replace existing nameservers with Netlify's nameservers
- Save changes

**Note:** DNS changes can take 24-48 hours to propagate.

---

### Option B: Use Existing DNS (More Control)

**If you want to keep your current DNS provider:**

1. In Netlify Domain settings, click on your domain
2. Click **"Configure DNS"** or **"Set up DNS"**
3. Netlify will show you DNS records to add

**Add these DNS records at your domain registrar:**

#### For Root Domain (tadabburtours.com):

**Type:** `A`  
**Name:** `@` (or leave blank)  
**Value:** `75.2.60.5` (Netlify's IP address - check Netlify for current IP)  
**TTL:** `3600` (or auto)

**OR**

**Type:** `CNAME`  
**Name:** `@` (or leave blank)  
**Value:** `tadabbur-tours.netlify.app`  
**TTL:** `3600` (or auto)

**Note:** Some registrars don't allow CNAME for root domain. Use A record instead.

#### For www Subdomain (www.tadabburtours.com):

**Type:** `CNAME`  
**Name:** `www`  
**Value:** `tadabbur-tours.netlify.app`  
**TTL:** `3600` (or auto)

---

## 🔍 Step 3: Verify DNS Configuration

### 3.1 Check DNS Propagation

1. Go to **[whatsmydns.net](https://www.whatsmydns.net/)**
2. Enter your domain: `tadabburtours.com`
3. Select record type: `A` or `CNAME`
4. Check if DNS has propagated worldwide

**Note:** DNS changes can take anywhere from a few minutes to 48 hours.

### 3.2 Check in Netlify

1. Go to **Domain settings** in Netlify
2. Check domain status:
   - ✅ **"Active"** - Domain is working
   - ⚠️ **"Pending"** - DNS still propagating
   - ❌ **"Error"** - Check DNS configuration

---

## 🚨 Common Issues & Fixes

### Issue: Domain Not Resolving

**Symptoms:**
- `tadabburtours.com` shows "Site not found" or times out
- `tadabburtours.netlify.app` works fine

**Fixes:**

1. **Check DNS records are correct:**
   - Verify A record points to Netlify IP
   - Verify CNAME record points to Netlify subdomain
   - Check for typos in DNS records

2. **Wait for DNS propagation:**
   - DNS changes can take 24-48 hours
   - Use [whatsmydns.net](https://www.whatsmydns.net/) to check status

3. **Clear DNS cache:**
   - On your computer: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)
   - Or use different DNS server (e.g., Google DNS: 8.8.8.8)

### Issue: Domain Shows "Pending" in Netlify

**Fixes:**

1. **Verify DNS records are added correctly**
2. **Wait for DNS propagation** (can take up to 48 hours)
3. **Check if domain is verified** - Netlify may need to verify ownership

### Issue: SSL Certificate Not Working

**Fixes:**

1. **Wait for SSL provisioning:**
   - Netlify automatically provisions SSL certificates
   - Can take a few minutes to a few hours

2. **Check SSL status in Netlify:**
   - Go to **Domain settings**
   - Look for **"HTTPS"** section
   - Should show **"Certificate issued"** when ready

3. **Force SSL renewal:**
   - Go to **Domain settings** → **HTTPS**
   - Click **"Renew certificate"** if needed

---

## 🔐 Step 4: Enable HTTPS (SSL)

Netlify automatically provisions SSL certificates for custom domains.

### 4.1 Check SSL Status

1. Go to **Domain settings** → **HTTPS**
2. Look for **"Certificate"** section
3. Should show **"Certificate issued"** when ready

### 4.2 Force HTTPS

1. Go to **Site settings** → **Build & deploy** → **Post processing**
2. Enable **"Force HTTPS"** (redirects HTTP to HTTPS)
3. Save settings

---

## 📝 Step 5: Update Environment Variables

Once your domain is working, update your Stripe environment variables:

### Update These URLs in Netlify:

1. Go to **Site settings** → **Environment variables**
2. Update:
   - `STRIPE_SUCCESS_URL` → `https://tadabburtours.com/booking-success`
   - `STRIPE_CANCEL_URL` → `https://tadabburtours.com/booking-cancel`
3. Also update your webhook endpoint in Stripe Dashboard:
   - `https://tadabburtours.com/api/stripe/webhook`

---

## 🎯 Quick Checklist

- [ ] Domain added to Netlify
- [ ] DNS records added at domain registrar
- [ ] DNS records verified (A or CNAME)
- [ ] Waited for DNS propagation (24-48 hours)
- [ ] Domain shows "Active" in Netlify
- [ ] SSL certificate issued
- [ ] HTTPS enabled
- [ ] Environment variables updated with custom domain
- [ ] Webhook endpoint updated in Stripe

---

## 🔍 How to Check Your Domain Registrar

### Common Domain Registrars:

- **GoDaddy:** dcc.godaddy.com → My Products → Domains → DNS
- **Namecheap:** namecheap.com → Domain List → Manage → Advanced DNS
- **Google Domains:** domains.google.com → DNS
- **Cloudflare:** dash.cloudflare.com → DNS
- **Name.com:** name.com → Domains → DNS Records

### What to Look For:

1. **DNS Management** or **DNS Settings**
2. **Nameservers** section
3. **DNS Records** or **Advanced DNS** section

---

## 🆘 Still Not Working?

### Debug Steps:

1. **Check DNS records:**
   ```bash
   # In terminal/command prompt:
   nslookup tadabburtours.com
   # Or:
   dig tadabburtours.com
   ```

2. **Check Netlify logs:**
   - Go to **Site settings** → **Domain settings**
   - Look for error messages or warnings

3. **Check domain status:**
   - Verify domain is active in Netlify
   - Check for any verification requirements

4. **Contact support:**
   - Netlify Support: support@netlify.com
   - Or use Netlify's chat support

---

## 📚 Additional Resources

- [Netlify Domain Documentation](https://docs.netlify.com/domains-https/custom-domains/)
- [Netlify DNS Documentation](https://docs.netlify.com/domains-https/netlify-dns/)
- [DNS Propagation Checker](https://www.whatsmydns.net/)

---

**Need help?** Let me know:
- What domain registrar you're using
- What DNS records you currently have
- Any error messages you're seeing

