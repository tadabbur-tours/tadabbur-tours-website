# Tadabbur Tours - Next.js Setup Guide

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory with:
   ```env
   # Stripe Configuration
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

   # Database (add your database connection string)
   DATABASE_URL=your_database_connection_string_here

   # Email Service (add your email service configuration)
   EMAIL_SERVICE_API_KEY=your_email_service_key_here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
tadabbur-tours/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── bookings/route.ts          # Booking API endpoints
│   │   │   └── payments/
│   │   │       ├── create-intent/route.ts # Stripe payment intent
│   │   │       └── webhook/route.ts       # Stripe webhooks
│   │   ├── globals.css                    # Global styles
│   │   ├── layout.tsx                     # Root layout
│   │   └── page.tsx                       # Main page component
│   └── components/
│       └── BookingModal.tsx               # Booking modal component
├── public/                                # Static assets (images)
├── package.json
└── tailwind.config.js
```

## 🔧 Features Implemented

### ✅ Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Responsive design** for all devices
- **Interactive components** (slideshow, carousel, modal)
- **Form validation** and user experience

### ✅ Backend APIs
- **Booking API** (`/api/bookings`) - Save and retrieve bookings
- **Payment API** (`/api/payments/create-intent`) - Create Stripe payment intents
- **Webhook API** (`/api/payments/webhook`) - Handle Stripe events

### ✅ Stripe Integration
- **Payment processing** with Stripe
- **Secure payment intents**
- **Webhook handling** for payment confirmations
- **Multiple payment methods** support

### ✅ Booking System
- **Multi-step booking form**
- **Room selection** with dynamic pricing
- **Participant information** collection
- **Payment method** selection
- **Booking summary** and confirmation

## 🎨 Design Features

- **Modern UI/UX** with gradient backgrounds
- **Smooth animations** and transitions
- **Interactive elements** (hover effects, scaling)
- **Professional typography** and spacing
- **Mobile-first** responsive design
- **Accessibility** considerations

## 🔌 API Endpoints

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings` - Retrieve all bookings

### Payments
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/webhook` - Handle Stripe webhooks

## 🛠️ Customization

### Adding New Packages
Edit the `packages` array in `src/app/page.tsx`:
```typescript
const packages = [
  {
    id: 'new-package',
    name: 'New Package Name',
    price: '$3,500',
    duration: '10 days',
    dates: 'March 1-10, 2026',
    status: 'standard',
    soldOut: false
  }
];
```

### Adding New Sacred Sites
Edit the `sacredSites` array in `src/app/page.tsx`:
```typescript
const sacredSites = [
  {
    name: 'New Site',
    image: 'new-site.jpg',
    description: 'Description of the new site'
  }
];
```

### Styling Customization
- Edit `src/app/globals.css` for global styles
- Use Tailwind classes for component styling
- Modify color scheme in `tailwind.config.js`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Works with Next.js
- **Railway**: Good for full-stack apps
- **DigitalOcean**: VPS deployment

## 🔐 Security Considerations

- **Environment variables** for sensitive data
- **Stripe webhook verification** for payment security
- **Input validation** on all forms
- **HTTPS** required for production
- **Rate limiting** recommended for APIs

## 📧 Email Integration

To add email notifications:
1. Choose an email service (SendGrid, Resend, etc.)
2. Add API key to environment variables
3. Implement email functions in API routes
4. Send confirmation emails after booking

## 🗄️ Database Integration

To add database persistence:
1. Choose a database (PostgreSQL, MongoDB, etc.)
2. Add connection string to environment variables
3. Implement database functions in API routes
4. Add data models and schemas

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📱 Mobile Optimization

The website is fully responsive and optimized for:
- **Mobile phones** (320px+)
- **Tablets** (768px+)
- **Desktop** (1024px+)
- **Large screens** (1440px+)

## 🎯 Performance

- **Next.js optimization** for fast loading
- **Image optimization** with Next.js Image component
- **Code splitting** for smaller bundles
- **SEO optimization** with proper meta tags

## 🔄 Future Enhancements

- **User authentication** and accounts
- **Booking management** dashboard
- **Email notifications** system
- **Database integration** for persistence
- **Admin panel** for managing bookings
- **Multi-language** support
- **Advanced payment** options

## 📞 Support

For questions or issues:
1. Check the documentation
2. Review the code comments
3. Test with Stripe test cards
4. Verify environment variables

## 🎉 Ready to Launch!

Your Next.js website is now ready with:
- ✅ Modern framework setup
- ✅ API routes for backend functionality
- ✅ Stripe payment integration
- ✅ Responsive design
- ✅ Booking system
- ✅ Professional UI/UX

Just add your Stripe keys and deploy! 🚀

