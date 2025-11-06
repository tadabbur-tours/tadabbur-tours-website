# 🔔 Stripe Notifications Setup Guide

Complete guide to set up email notifications in Stripe for payments, disputes, and important events.

---

## 📧 Step 1: Access Notification Settings

1. Go to **[Stripe Dashboard](https://dashboard.stripe.com)**
2. Click **"Settings"** in the left sidebar
3. Click **"Notifications"** in the submenu
   - Or go directly to: https://dashboard.stripe.com/settings/notifications

---

## ⚙️ Step 2: Configure Email Notifications

### 2.1 Email Recipients

1. Scroll to **"Email recipients"** section
2. Click **"Add email address"**
3. Enter your email address (e.g., `info@tadabburtours.com`)
4. Click **"Add"**
5. Repeat for additional email addresses if needed

**Note:** You can add multiple email addresses to receive notifications.

---

## 🔔 Step 3: Select Notification Events

Scroll down to **"What to notify"** section. Enable notifications for:

### ✅ **Payment Notifications (Recommended)**

- [ ] **Successful payments** - Get notified when customers complete payments
- [ ] **Failed payments** - Get notified when payments fail or are declined
- [ ] **Partially refunded payments** - Get notified when refunds are issued
- [ ] **Fully refunded payments** - Get notified when full refunds are issued

### ✅ **Dispute & Chargeback Notifications (Important)**

- [ ] **Dispute created** - Get notified immediately when a dispute is filed
- [ ] **Dispute updated** - Get notified when dispute status changes
- [ ] **Dispute closed** - Get notified when dispute is resolved

**Why important:** You have limited time to respond to disputes (usually 7-21 days)

### ✅ **Payout Notifications (Recommended)**

- [ ] **Payout paid** - Get notified when money is sent to your bank account
- [ ] **Payout failed** - Get notified if payout fails (e.g., wrong bank details)

### ✅ **Account & Security Notifications (Important)**

- [ ] **Account updated** - Get notified when account settings change
- [ ] **API key created** - Get notified when new API keys are created
- [ ] **API key deleted** - Get notified when API keys are deleted
- [ ] **Webhook endpoint disabled** - Get notified if webhook endpoint fails

### ✅ **Invoice Notifications (If Using Invoices)**

- [ ] **Invoice created** - Get notified when invoices are created
- [ ] **Invoice payment succeeded** - Get notified when invoices are paid
- [ ] **Invoice payment failed** - Get notified when invoice payments fail

---

## 📋 Recommended Notification Settings

### **Essential (Must Have):**

✅ **Dispute created** - Critical for responding quickly  
✅ **Payout failed** - Important for cash flow  
✅ **Webhook endpoint disabled** - Critical for payment processing  
✅ **Failed payments** - Important for customer service

### **Important (Should Have):**

✅ **Successful payments** - Track revenue  
✅ **Payout paid** - Confirm money received  
✅ **API key created/deleted** - Security monitoring

### **Optional (Nice to Have):**

✅ **Refund notifications** - Track refunds  
✅ **Account updated** - Monitor account changes

---

## 🎯 Step 4: Set Notification Frequency

### **Real-time (Recommended)**

- Notifications sent immediately when events occur
- Best for: Disputes, failed payments, security alerts

### **Daily Digest**

- One email per day summarizing all events
- Best for: Successful payments, routine updates

### **Weekly Summary**

- One email per week summarizing events
- Best for: Low-volume accounts

**Recommendation:** Use **real-time** for critical events (disputes, failures) and **daily digest** for routine events (successful payments).

---

## 📱 Step 5: Mobile Notifications (Optional)

1. Scroll to **"Mobile notifications"** section
2. Download **Stripe Dashboard** mobile app
3. Enable push notifications for:
   - Disputes
   - Failed payments
   - Payout issues

**Benefit:** Get instant alerts on your phone

---

## 🔔 Step 6: Webhook Notifications (Already Configured)

Your webhook endpoint is already set up:
- **Endpoint:** `https://tadabburtours.netlify.app/api/stripe/webhook`
- **Events:** `checkout.session.completed`

**Note:** Webhook notifications are different from email notifications:
- **Webhooks:** Send data to your server (automated processing)
- **Email notifications:** Send alerts to your email (manual monitoring)

---

## ✅ Step 7: Test Your Notifications

### Test Email Notifications:

1. Go to **Settings** → **Notifications**
2. Click **"Send test email"** at the top
3. Check your inbox for the test email

### Test with Real Events:

1. Make a test payment (small amount)
2. Check if you receive "Successful payment" email
3. Try a failed payment (declined card)
4. Check if you receive "Failed payment" email

---

## 📊 Notification Email Examples

### Successful Payment Email:
```
Subject: Payment succeeded: $1,543.80

You received a payment of $1,543.80 from customer@example.com
Payment ID: ch_1234567890
Date: November 5, 2025
```

### Dispute Email:
```
Subject: Dispute created: ch_1234567890

A dispute has been filed for payment ch_1234567890
Amount: $1,543.80
Reason: Product not received
Response deadline: November 12, 2025
```

### Failed Payment Email:
```
Subject: Payment failed: ch_1234567890

A payment of $1,543.80 failed
Customer: customer@example.com
Reason: Your card was declined
```

---

## 🎯 Best Practices

### 1. **Set Up Multiple Recipients**
- Add backup email addresses
- Use a team email (e.g., `bookings@tadabburtours.com`)
- Consider adding owner/admin emails

### 2. **Don't Over-Notify**
- Only enable notifications you'll actually check
- Use daily digest for routine events
- Use real-time for critical events

### 3. **Monitor Disputes Closely**
- Enable all dispute notifications
- Check email daily for disputes
- Respond within 24 hours

### 4. **Set Up Filters (Optional)**
- Use email filters to organize notifications
- Create folders: "Disputes", "Payments", "Alerts"
- Mark important emails as priority

---

## 🆘 Troubleshooting

### Not Receiving Emails

1. **Check spam folder** - Stripe emails might be filtered
2. **Verify email address** - Check it's correct in settings
3. **Check notification settings** - Make sure events are enabled
4. **Test email** - Use "Send test email" feature
5. **Check email provider** - Some providers block automated emails

### Too Many Emails

1. **Switch to daily digest** - Reduce email frequency
2. **Disable non-essential notifications** - Turn off what you don't need
3. **Use email filters** - Organize notifications automatically

### Missing Important Notifications

1. **Enable real-time notifications** - Don't use weekly digest for critical events
2. **Check all recipients** - Make sure emails aren't bouncing
3. **Set up mobile notifications** - Get alerts on your phone

---

## 📱 Mobile App Setup

### Download Stripe Dashboard App:

1. **iOS:** [App Store](https://apps.apple.com/app/stripe-dashboard/id1339232029)
2. **Android:** [Google Play](https://play.google.com/store/apps/details?id=com.stripe.stripe)

### Enable Push Notifications:

1. Open Stripe Dashboard app
2. Go to **Settings** → **Notifications**
3. Enable push notifications for:
   - ✅ Disputes
   - ✅ Failed payments
   - ✅ Payout issues
   - ✅ Security alerts

---

## 🔐 Security Notifications

### Critical Security Alerts:

Enable notifications for:
- ✅ **API key created/deleted** - Detect unauthorized access
- ✅ **Account settings changed** - Monitor account modifications
- ✅ **Webhook endpoint disabled** - Catch payment processing issues
- ✅ **Login from new device** - Monitor account access

---

## 📊 Notification Dashboard

### View Notification History:

1. Go to **Settings** → **Notifications**
2. Scroll to **"Notification history"**
3. See all sent notifications
4. Check delivery status

### Analytics:

- Track notification delivery rates
- See which events trigger most notifications
- Monitor notification performance

---

## ✅ Quick Setup Checklist

- [ ] Add email recipients (at least 2)
- [ ] Enable **Dispute created** (critical)
- [ ] Enable **Failed payments** (important)
- [ ] Enable **Payout failed** (important)
- [ ] Enable **Webhook endpoint disabled** (critical)
- [ ] Set **Real-time** for critical events
- [ ] Set **Daily digest** for routine events
- [ ] Send test email to verify
- [ ] Set up mobile notifications (optional)
- [ ] Configure email filters (optional)

---

## 📚 Additional Resources

- [Stripe Notifications Documentation](https://stripe.com/docs/notifications)
- [Stripe Dashboard - Notifications](https://dashboard.stripe.com/settings/notifications)
- [Stripe Mobile App](https://stripe.com/docs/dashboard/mobile)

---

**✅ Once configured, you'll receive email alerts for important payment events!**

