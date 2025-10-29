# 🔐 Stripe Payment Setup Guide

## ⚠️ Current Issue

You're seeing this error because **Stripe API keys are not configured**:

```
Failed to initialize payment. Please try again or contact support.
```

This happens because the `.env.local` file has placeholder values instead of real Stripe keys.

---

## 🎯 Quick Fix (5 Minutes)

### Step 1: Get Your Stripe Account

1. Go to **[stripe.com](https://stripe.com)** 
2. Sign up for a free account (or log in if you have one)
3. No credit card required for test mode!

### Step 2: Get Your API Keys

1. After logging in, click **"Developers"** in the left sidebar
2. Click **"API keys"** in the submenu
3. You'll see two keys:

   **📌 Publishable key** (shows by default)
   ```
   Looks like: pk_test_51ABCxyz...
   ```
   
   **🔒 Secret key** (click "Reveal test key")
   ```
   Looks like: sk_test_51ABCxyz...
   ```

### Step 3: Add Keys to Your Project

1. Open the file `.env.local` in your project root
2. Replace the placeholder values:

   **BEFORE:**
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key_here
   STRIPE_SECRET_KEY=your_secret_key_here
   ```

   **AFTER:**
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC...your_real_key
   STRIPE_SECRET_KEY=sk_test_51ABC...your_real_key
   ```

3. Save the file

### Step 4: Restart Your Server

Stop your dev server (Ctrl+C) and restart it:

```bash
npm run dev
```

---

## ✅ Testing Your Setup

Once configured, test with these **test credit cards**:

| Card Number | Result | Use Case |
|------------|--------|----------|
| `4242 4242 4242 4242` | ✅ Success | Test successful payment |
| `4000 0000 0000 0002` | ❌ Decline | Test declined card |
| `4000 0025 0000 3155` | 🔐 3D Secure | Test authentication |

- Use **any future expiry date** (e.g., `12/25`)
- Use **any 3-digit CVC** (e.g., `123`)
- Use **any ZIP code** (e.g., `12345`)

---

## 🔍 How to Verify It's Working

1. Go to your website
2. Click **"Book Now"** on any package
3. Fill out the booking form
4. Select **"Credit/Debit Card (Stripe)"** as payment method
5. Click **"Next"**

**If working correctly:**
- ✅ You'll see the Stripe payment form with card input fields
- ✅ No error messages

**If still showing error:**
- ❌ Check that you copied the ENTIRE key (they're very long)
- ❌ Make sure there are no extra spaces
- ❌ Confirm you restarted the dev server after saving

---

## 🎨 What You'll Get

After setup, your payment page will show:

- **Beautiful embedded Stripe UI**
- **Support for 40+ payment methods**
- **Apple Pay & Google Pay** (if available)
- **Automatic validation**
- **Real-time error handling**
- **Secure PCI-compliant checkout**

---

## 🆘 Still Having Issues?

### Error: "Stripe is not configured"
- ✅ Make sure `.env.local` file exists in project root
- ✅ Verify keys don't have quotes around them
- ✅ Restart dev server after changing `.env.local`

### Error: "Invalid API Key"
- ✅ Make sure you're using **test keys** (starting with `pk_test_` and `sk_test_`)
- ✅ Don't mix up publishable and secret keys
- ✅ Copy the full key (they're ~100+ characters long)

### Payment form not showing
- ✅ Check browser console for errors (F12)
- ✅ Make sure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` starts with `NEXT_PUBLIC_`
- ✅ Clear browser cache and reload

---

## 🚀 Going Live (Production)

When ready for real payments:

1. Complete Stripe account verification
2. Get your **live keys** from Stripe Dashboard
3. Replace `pk_test_` with `pk_live_`
4. Replace `sk_test_` with `sk_live_`
5. Set up webhooks for production
6. Test thoroughly before launch!

---

## 📚 Additional Resources

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe Documentation](https://stripe.com/docs)
- [Test Card Numbers](https://stripe.com/docs/testing)
- [Payment Element Docs](https://stripe.com/docs/payments/payment-element)

---

## 🔐 Security Notes

- ⚠️ **NEVER** commit `.env.local` to Git
- ⚠️ **NEVER** share your secret key
- ⚠️ Use **test keys** for development
- ⚠️ Use **live keys** only in production
- ✅ `.env.local` is already in `.gitignore`

---

**Need help?** The error messages now show detailed information about what went wrong. Check the browser console (F12) for more details.






