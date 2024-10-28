# Expert Booking Platform

A professional platform for connecting clients with industry experts, built with modern web technologies and best practices.

## 🚀 Features

### Authentication & Authorization
- Social auth (Google, GitHub)
- Passwordless email login
- Role-based access (client, expert, admin)
- Protected routes with middleware

### Expert Profiles
- Verified expert profiles
- Dynamic availability calendar
- Tiered pricing models
- Portfolio/testimonials
- Expertise categories
- Social media integration
- Location and timezone support

### Booking System
- Real-time availability checks
- Google Calendar integration
- Smart timezone handling
- Configurable buffer times
- Flexible session durations
- Online/in-person options
- Rescheduling support

### Payments
- Stripe integration
- Paystack integration
- Multiple currency support
- Automatic currency conversion
- Secure payment processing
- Refund handling
- Dispute management

### Reviews & Ratings
- Verified booking reviews
- Multi-category ratings
- Review moderation
- Response system
- Rating analytics

### Admin Dashboard
- User management
- Expert verification
- Booking oversight
- Content moderation
- System health monitoring
- Analytics dashboard
- Payment transaction management

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- TanStack Query
- Tailwind CSS
- shadcn/ui components
- Radix UI primitives

### Backend
- Supabase
  - Auth
  - PostgreSQL Database
  - Real-time subscriptions
  - Storage
- Edge Functions

### Email
- Resend
- React Email templates

### Payments
- Stripe
- Paystack

### Monitoring
- Sentry error tracking
- PostHog analytics
- Custom health checks
- Performance monitoring

### Testing
- Jest
- React Testing Library
- Playwright E2E
- Load testing (k6)
- Security scanning (Snyk)

### DevOps
- GitHub Actions
- Automated testing
- Preview deployments
- Production safeguards

## 📦 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── experts/           # Expert listing/profiles
├── components/            # React components
│   ├── admin/            # Admin dashboard components
│   ├── booking/          # Booking flow components
│   ├── experts/          # Expert-related components
│   ├── profile/          # Profile management
│   └── ui/               # Reusable UI components
├── lib/                   # Core functionality
│   ├── api/              # API services
│   ├── auth/             # Authentication logic
│   ├── email/            # Email templates
│   ├── monitoring/       # Monitoring setup
│   ├── security/         # Security measures
│   └── supabase/         # Database setup
└── types/                # TypeScript types
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account
- Resend account
- Paystack account (optional)

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/expert-booking-platform.git
   cd expert-booking-platform
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Configure environment variables:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_service_key

   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   STRIPE_SECRET_KEY=your_stripe_secret
   STRIPE_WEBHOOK_SECRET=your_webhook_secret

   # Paystack (Optional)
   PAYSTACK_SECRET_KEY=your_paystack_key
   PAYSTACK_PUBLIC_KEY=your_paystack_public_key

   # Resend
   RESEND_API_KEY=your_resend_key

   # Monitoring
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
   ```

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### E2E Tests
```bash
# Install browsers
npx playwright install

# Run E2E tests
npm run test:e2e

# Open Playwright UI
npm run test:e2e:ui
```

### Load Testing
```bash
# Run k6 load tests
npm run test:load
```

### Security Testing
```bash
# Run security scan
npm run test:security
```

## 🔒 Security Features

- CSRF protection
- Rate limiting
- Input sanitization
- SQL injection prevention
- XSS protection
- Secure headers
- Audit logging
- Data encryption
- Webhook signature verification

## 📊 Monitoring

### Error Tracking
- Real-time error monitoring
- Error grouping and analysis
- Performance impact tracking
- Release tracking

### Analytics
- User behavior tracking
- Feature usage analytics
- Conversion funnels
- Custom events

### Performance
- Core Web Vitals
- API response times
- Database performance
- Real-time metrics

### Health Checks
- Service health monitoring
- Database connectivity
- External service status
- Custom health metrics

## 🚀 Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Run database migrations:
   ```bash
   npm run db:migrate
   ```

3. Start production server:
   ```bash
   npm run start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit changes:
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. Push to branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)
- [Stripe](https://stripe.com)
- [Paystack](https://paystack.com)
- [Resend](https://resend.com)
- [Sentry](https://sentry.io)
- [PostHog](https://posthog.com)