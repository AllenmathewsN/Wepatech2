# PhonePlace Deployment Guide

This guide covers deploying PhonePlace to various platforms.

## Prerequisites

- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 18+ installed locally
- Project built and tested locally

## Platform Options

### 1. Vercel (Recommended) ⭐

**Best for**: Quick deployment, automatic CI/CD, excellent Next.js support

#### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/phoneplace.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: Next.js (auto-detected)
     - Build Command: `npm run build`
     - Output Directory: `.next`
   - Add Environment Variables:
     ```
     JWT_SECRET=your-secure-random-string-here
     ```
   - Click "Deploy"

3. **Post-Deployment**
   - Your app will be live at `https://your-project.vercel.app`
   - Vercel automatically handles:
     - SSL certificates
     - CDN distribution
     - Automatic deployments on git push

**Note**: SQLite works on Vercel but data resets on each deployment. For production, migrate to PostgreSQL.

---

### 2. Railway

**Best for**: Full-stack apps with persistent database

#### Steps:

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway auto-detects Next.js

3. **Configure**
   - Add environment variables in Settings:
     ```
     JWT_SECRET=your-secure-random-string
     ```
   - Railway provides persistent disk for SQLite

4. **Custom Domain** (optional)
   - Go to Settings → Domains
   - Add your custom domain

---

### 3. Render

**Best for**: Free tier with persistent storage

#### Steps:

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your repository
   - Configure:
     - Name: phoneplace
     - Environment: Node
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`

3. **Add Persistent Disk**
   - In service settings, add disk:
     - Mount Path: `/opt/render/project/src`
     - Size: 1GB (free tier)

4. **Environment Variables**
   ```
   JWT_SECRET=your-secure-random-string
   NODE_ENV=production
   ```

---

### 4. DigitalOcean App Platform

**Best for**: Scalable production deployments

#### Steps:

1. **Create DigitalOcean Account**
   - Go to [digitalocean.com](https://digitalocean.com)

2. **Create App**
   - Go to Apps → Create App
   - Connect GitHub repository
   - Configure:
     - Type: Web Service
     - Build Command: `npm run build`
     - Run Command: `npm start`

3. **Add Environment Variables**
   ```
   JWT_SECRET=your-secure-random-string
   ```

4. **Add Database** (optional)
   - Add PostgreSQL database component
   - Update connection in code

---

## Database Migration (SQLite → PostgreSQL)

For production, migrate to PostgreSQL:

### 1. Install PostgreSQL Driver

```bash
npm install pg
```

### 2. Update Database Connection

Create `src/lib/db-postgres.ts`:

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default pool;
```

### 3. Update Queries

Replace SQLite queries with PostgreSQL-compatible syntax:
- `INTEGER PRIMARY KEY AUTOINCREMENT` → `SERIAL PRIMARY KEY`
- `DATETIME DEFAULT CURRENT_TIMESTAMP` → `TIMESTAMP DEFAULT NOW()`
- `.get()` → `query().then(res => res.rows[0])`
- `.all()` → `query().then(res => res.rows)`

### 4. Add Database URL

```env
DATABASE_URL=postgresql://user:password@host:5432/database
```

---

## Environment Variables

### Required

```env
JWT_SECRET=your-secure-random-string-minimum-32-characters
```

### Optional (Production)

```env
# Database
DATABASE_URL=postgresql://...

# M-Pesa
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# AWS S3 (for images)
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=phoneplace-images

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Custom Domain Setup

### Vercel

1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. SSL automatically provisioned

### Railway

1. Go to Settings → Domains
2. Add custom domain
3. Update CNAME record to Railway URL

### Render

1. Go to Settings → Custom Domains
2. Add domain
3. Update DNS records

---

## Performance Optimization

### 1. Enable Caching

Add to `next.config.js`:

```javascript
module.exports = {
  images: {
    domains: ['your-cdn-domain.com'],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=60, stale-while-revalidate=120' },
        ],
      },
    ];
  },
};
```

### 2. Use CDN for Images

- Upload product images to AWS S3 or Cloudinary
- Update image URLs in database
- Enable Next.js Image Optimization

### 3. Database Indexing

Already included in schema:
- Products by category
- Products by slug
- Cart items by cart
- Orders by user

---

## Monitoring & Analytics

### 1. Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
```

Add to `next.config.js`:

```javascript
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  nextConfig,
  { silent: true },
  { hideSourceMaps: true }
);
```

### 2. Analytics (Google Analytics)

Add to `src/app/layout.tsx`:

```typescript
import Script from 'next/script';

// In layout
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
  strategy="afterInteractive"
/>
```

### 3. Uptime Monitoring

- Use UptimeRobot (free)
- Monitor: https://yourdomain.com/api/health

---

## Security Checklist

- [ ] Change JWT_SECRET to secure random string
- [ ] Enable HTTPS (automatic on most platforms)
- [ ] Set secure cookie flags in production
- [ ] Add rate limiting to API routes
- [ ] Implement CORS if needed
- [ ] Add CSP headers
- [ ] Regular dependency updates
- [ ] Database backups enabled

---

## Post-Deployment Tasks

1. **Test All Features**
   - User registration and login
   - Product browsing and search
   - Add to cart and checkout
   - Order placement
   - Admin dashboard

2. **Seed Production Database**
   ```bash
   # SSH into server or use platform CLI
   npm run seed
   ```

3. **Configure Email Notifications**
   - Set up SMTP credentials
   - Test order confirmation emails

4. **Set Up Backups**
   - Database backups (daily)
   - File storage backups

5. **Monitor Performance**
   - Set up error tracking
   - Monitor response times
   - Check database query performance

---

## Troubleshooting

### Build Fails

- Check Node.js version (18+)
- Clear `.next` folder
- Verify all dependencies installed
- Check for TypeScript errors

### Database Connection Issues

- Verify DATABASE_URL format
- Check SSL settings
- Ensure database is accessible from deployment platform

### Images Not Loading

- Check image paths
- Verify Next.js Image domains configuration
- Ensure images are accessible

### API Routes Failing

- Check environment variables
- Verify API route paths
- Check CORS settings if needed

---

## Scaling Considerations

### When to Scale

- More than 1000 daily active users
- Database queries slowing down
- High traffic during sales

### Scaling Options

1. **Database**
   - Migrate to PostgreSQL
   - Add read replicas
   - Implement caching (Redis)

2. **Application**
   - Enable CDN
   - Add load balancer
   - Horizontal scaling

3. **Storage**
   - Move images to S3/Cloudinary
   - Implement lazy loading
   - Optimize image sizes

---

## Support

For deployment issues:
1. Check platform documentation
2. Review error logs
3. Test locally first
4. Verify environment variables

---

## Quick Deploy Commands

```bash
# Build locally
npm run build

# Test production build
npm start

# Deploy to Vercel
vercel

# Deploy to Railway
railway up

# Deploy to Render
# Use Render dashboard
```

---

**Ready to deploy?** Choose your platform and follow the steps above!
