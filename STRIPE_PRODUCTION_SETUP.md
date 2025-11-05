# 🚀 Stripe Production Setup Guide

Complete guide to set up Stripe for **real payments** in production.

---

## 📋 Prerequisites Checklist

Before going live, ensure you have:

- [ ] Stripe account created and verified
- [ ] Business information completed in Stripe Dashboard
- [ ] Bank account connected for payouts
- [ ] Production API keys ready
- [ ] Webhook endpoint configured
- [ ] Environment variables updated
- [ ] Tested with real payment methods

---

## Step 1: Verify Your Stripe Account

### 1.1 Complete Account Verification

1. Go to **[dashboard.stripe.com](https://dashboard.stripe.com)**
2. Navigate to **Settings** → **Account**
3. Complete all required fields:
   - **Business type** (Individual or Company)
   - **Business name** and address
   - **Tax information** (EIN/SSN)
   - **Identity verification** (upload documents if required)
   - **Bank account** for receiving payouts

### 1.2 Enable Required Features

1. Go to **Settings** → **Payment methods**
2. Enable:
   - ✅ **Cards**
   - ✅ **ACH Direct Debit** (for bank transfers)
   - ✅ **Link** (Stripe's one-click checkout)

---

## Step 2: Get Production API Keys

### 2.1 Switch to Live Mode

1. In Stripe Dashboard, toggle **"Test mode"** OFF (top right)
2. You should see **"Live mode"** indicator

### 2.2 Get Your Live Keys

1. Go to **Developers** → **API keys**
2. You'll see two keys:

   **📌 Publishable key** (shows by default - starts with `pk_live_`)
   ```
   pk_live_51ABCxyz...
   ```

   **🔒 Secret key** (click "Reveal live key" - starts with `sk_live_`)
   ```
   sk_live_51ABCxyz...
   ```

3. **IMPORTANT:** Copy both keys and store them securely

---

## Step 3: Set Up Production Webhooks

### 3.1 Create Webhook Endpoint

1. Go to **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Enter your production webhook URL:
   ```
   https://yourdomain.com/api/stripe/webhook
   ```
   (Replace `yourdomain.com` with your actual domain, e.g., `tadabburtours.com`)

4. Select events to listen for:
   - ✅ **`checkout.session.completed`** - When payment is successful
   - ✅ **`payment_intent.succeeded`** - Backup event (optional)
   - ✅ **`payment_intent.payment_failed`** - For failed payments (optional)

5. Click **"Add endpoint"**

### 3.2 Get Webhook Signing Secret

1. After creating the endpoint, click on it
2. Click **"Reveal"** next to "Signing secret"
3. Copy the secret (starts with `whsec_`)
   ```
   whsec_ABCxyz...
   ```

---

## Step 4: Update Environment Variables

### 4.1 For Vercel/Netlify (Production)

1. Go to your hosting platform's dashboard:
   - **Vercel**: Project Settings → Environment Variables
   - **Netlify**: Site Settings → Environment Variables

2. Add/Update these **Production** environment variables:

   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_ACTUAL_KEY_HERE
   STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_KEY_HERE
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_SECRET_HERE
   STRIPE_SUCCESS_URL=https://yourdomain.com/booking-success
   STRIPE_CANCEL_URL=https://yourdomain.com/booking-cancel
   ```

   **⚠️ Important:**
   - Use your **actual domain** (e.g., `https://tadabburtours.com`)
   - No quotes needed around values
   - No spaces before/after the `=`

### 4.2 For Local Development (Keep Test Keys)

Keep your `.env.local` file with **test keys** for development:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
STRIPE_SUCCESS_URL=http://localhost:3000/booking-success
STRIPE_CANCEL_URL=http://localhost:3000/booking-cancel
```

---

## Step 5: Deploy and Test

### 5.1 Deploy Your Changes

1. Commit any pending changes
2. Push to your repository
3. Deploy to production (Vercel/Netlify will automatically deploy)

### 5.2 Verify Webhook Endpoint

1. After deployment, go to Stripe Dashboard → **Webhooks**
2. Find your webhook endpoint
3. You should see it's **active** (green indicator)
4. Click **"Send test webhook"** to verify it's working

### 5.3 Test with Real Payment Methods

**⚠️ IMPORTANT:** In live mode, you'll be charged real money!

**Small test amounts:**
1. Use a real credit card with a small test amount ($1-5)
2. Complete a full booking flow
3. Verify payment appears in Stripe Dashboard
4. Check that webhook events are received
5. Verify booking data is saved correctly

**Or use Stripe's test cards in live mode:**
- Stripe provides test card numbers that work in live mode for testing
- Check Stripe Dashboard → **Testing** for current test cards

---

## Step 6: Monitor and Maintain

### 6.1 Set Up Email Notifications

1. Go to **Settings** → **Notifications** in Stripe Dashboard
2. Enable email alerts for:
   - ✅ Payment failures
   - ✅ Disputes/Chargebacks
   - ✅ Payout issues
   - ✅ Webhook failures

### 6.2 Monitor Webhooks

1. Go to **Developers** → **Webhooks**
2. Check webhook logs regularly for:
   - Failed deliveries
   - Error responses
   - Missing events

### 6.3 Review Payments Dashboard

1. Monitor **Payments** section regularly
2. Watch for:
   - Unusual activity
   - Failed payments
   - Disputes

---

## 🔒 Security Checklist

Before going live, verify:

- [ ] **API keys** are stored as environment variables (never in code)
- [ ] **`.env.local`** is in `.gitignore` (already done)
- [ ] **Production keys** start with `pk_live_` and `sk_live_`
- [ ] **Webhook signing secret** is configured and validated
- [ ] **HTTPS** is enabled on your domain
- [ ] **Webhook endpoint** uses signature verification (already implemented)
- [ ] **No test keys** in production environment

---

## 🧪 Testing Checklist

Before accepting real payments:

- [ ] Test booking flow with small real payment ($1-5)
- [ ] Verify payment appears in Stripe Dashboard
- [ ] Verify webhook receives `checkout.session.completed` event
- [ ] Verify booking data is saved to Google Sheets (if configured)
- [ ] Verify booking confirmation email is sent (if configured)
- [ ] Test payment cancellation flow
- [ ] Test with different payment methods (card, ACH)
- [ ] Test with different room types (Quad, Triple, Dual)
- [ ] Test with multiple participants (deposit calculation)

---

## 🆘 Troubleshooting

### Payment Not Processing

1. **Check Stripe Dashboard** → **Logs** for errors
2. **Check browser console** (F12) for client-side errors
3. **Verify API keys** are correct and active
4. **Check webhook logs** for delivery failures

### Webhook Not Receiving Events

1. **Verify webhook URL** is correct and accessible
2. **Check webhook signing secret** matches
3. **Verify endpoint is deployed** and not returning 500 errors
4. **Test webhook** using Stripe Dashboard → "Send test webhook"

### Environment Variables Not Working

1. **Verify variables** are set in production environment (not just `.env.local`)
2. **Restart/redeploy** after changing environment variables
3. **Check variable names** match exactly (case-sensitive)
4. **No quotes** around values in environment variables

---

## 📊 Important URLs

- **Stripe Dashboard**: https://dashboard.stripe.com
- **Payments**: https://dashboard.stripe.com/payments
- **Webhooks**: https://dashboard.stripe.com/webhooks
- **API Keys**: https://dashboard.stripe.com/apikeys
- **Logs**: https://dashboard.stripe.com/logs

---

## 💰 Understanding Payouts

- **Payout schedule**: Check **Settings** → **Payments** → **Payout schedule**
- **Default**: 2 business days after payment
- **Minimum**: Can be adjusted to daily, weekly, etc.
- **Fees**: Stripe charges 2.9% + $0.30 per successful card payment, 0.8% for ACH (capped at $5)

---

## 📞 Support

- **Stripe Support**: https://support.stripe.com
- **Documentation**: https://stripe.com/docs
- **Status Page**: https://status.stripe.com

---

**✅ Once all steps are complete, your Stripe integration is ready for real payments!**

