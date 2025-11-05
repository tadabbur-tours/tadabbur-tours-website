# ✅ Stripe Production Quick Checklist

A quick reference checklist for going live with Stripe.

---

## 🔑 Step 1: Get Production Keys

- [ ] Log into [Stripe Dashboard](https://dashboard.stripe.com)
- [ ] Toggle to **"Live mode"** (top right)
- [ ] Go to **Developers** → **API keys**
- [ ] Copy **Publishable key** (starts with `pk_live_`)
- [ ] Copy **Secret key** (starts with `sk_live_`)

---

## 🎣 Step 2: Set Up Webhook

- [ ] Go to **Developers** → **Webhooks**
- [ ] Click **"Add endpoint"**
- [ ] Enter URL: `https://yourdomain.com/api/stripe/webhook`
- [ ] Select event: **`checkout.session.completed`**
- [ ] Copy **Signing secret** (starts with `whsec_`)

---

## ⚙️ Step 3: Update Environment Variables

Update these in your hosting platform (Vercel/Netlify):

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
STRIPE_SUCCESS_URL=https://yourdomain.com/booking-success
STRIPE_CANCEL_URL=https://yourdomain.com/booking-cancel
```

- [ ] Added `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (production)
- [ ] Added `STRIPE_SECRET_KEY` (production)
- [ ] Added `STRIPE_WEBHOOK_SECRET` (production)
- [ ] Updated URLs to production domain
- [ ] Redeployed after changes

---

## 🧪 Step 4: Test

- [ ] Test with small real payment ($1-5)
- [ ] Verify payment in Stripe Dashboard
- [ ] Verify webhook receives event
- [ ] Verify booking is saved
- [ ] Test cancellation flow

---

## 🔒 Security Check

- [ ] Using `pk_live_` and `sk_live_` (not `pk_test_` / `sk_test_`)
- [ ] HTTPS enabled on domain
- [ ] Webhook endpoint accessible
- [ ] No API keys in code/git

---

## 📊 Monitoring Setup

- [ ] Enabled email notifications in Stripe
- [ ] Checked webhook logs
- [ ] Verified payment dashboard access

---

**🎉 Ready to go live!**

For detailed instructions, see `STRIPE_PRODUCTION_SETUP.md`

