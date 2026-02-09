# PhonePlace - Online Marketplace for Phones & Accessories

A production-ready ecommerce marketplace built with Next.js, inspired by Jumia's design and functionality. Tailored for the Kenyan market with mobile-first UX.

## Features

### Customer Features
- 🏠 **Home Page** with hero carousel, category tiles, flash sales, and product recommendations
- 🔍 **Search** with keyword matching across products
- 📱 **Product Listings** with advanced filters (price, brand, rating, stock, discount)
- 🛍️ **Product Details** with image gallery, variants, delivery calculator, and reviews
- 🛒 **Shopping Cart** with quantity management and guest checkout support
- 💳 **Multi-step Checkout** with delivery info, payment method selection, and order review
- 📦 **Order Tracking** with status timeline (placed → processing → shipped → delivered)
- 👤 **User Account** with order history and profile management
- 🔐 **Authentication** with email/password and JWT sessions

### Admin Features
- 📊 **Dashboard** with key metrics (orders, revenue, users, products)
- 📋 **Order Management** with status updates
- 🔒 **Role-based Access Control**

### Technical Features
- ⚡ **Next.js 15** with App Router and Server Components
- 🎨 **Tailwind CSS** for responsive, mobile-first design
- 💾 **SQLite Database** with better-sqlite3 (production-ready, can switch to PostgreSQL)
- 🔐 **JWT Authentication** with httpOnly cookies
- 🛡️ **Secure Password Hashing** with bcryptjs
- 🎯 **State Management** with Zustand
- 🔔 **Toast Notifications** with react-hot-toast
- 📱 **Fully Responsive** - works perfectly on mobile, tablet, and desktop

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT, bcryptjs
- **State Management**: Zustand
- **Notifications**: react-hot-toast

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd PhonePlace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Seed the database**
   ```bash
   npm run seed
   ```

   This will create the database with:
   - 2 users (admin and regular user)
   - 6 categories
   - 23 products (phones and accessories)
   - Realistic product data with prices, specs, and ratings

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## Default Credentials

### Admin Account
- Email: `admin@phoneplace.com`
- Password: `password123`
- Access: Full admin dashboard at `/admin`

### User Account
- Email: `john@example.com`
- Password: `password123`
- Access: Regular user features

## Project Structure

```
PhonePlace/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Checkout flow
│   │   ├── account/           # User account
│   │   ├── admin/             # Admin dashboard
│   │   ├── p/[slug]/          # Product detail pages
│   │   ├── c/[category]/      # Category listing pages
│   │   ├── search/            # Search results
│   │   ├── orders/[id]/       # Order detail pages
│   │   └── api/               # API routes
│   │       ├── auth/          # Authentication endpoints
│   │       ├── cart/          # Cart management
│   │       ├── orders/        # Order management
│   │       ├── products/      # Product data
│   │       ├── categories/    # Category data
│   │       ├── search/        # Search functionality
│   │       └── admin/         # Admin endpoints
│   ├── components/            # React components
│   │   ├── Header.tsx         # Site header with search
│   │   ├── Footer.tsx         # Site footer
│   │   ├── ProductCard.tsx    # Product card component
│   │   ├── HeroBanner.tsx     # Hero carousel
│   │   └── FlashSale.tsx      # Flash sale section
│   ├── lib/                   # Utilities and helpers
│   │   ├── db.ts             # Database initialization
│   │   ├── auth.ts           # Authentication utilities
│   │   └── store.ts          # Zustand state management
│   └── types/                 # TypeScript type definitions
│       └── index.ts
├── scripts/
│   └── seed.js               # Database seeding script
├── public/                    # Static assets
├── phoneplace.db             # SQLite database (created on seed)
└── package.json
```

## Key Features Explained

### Mobile-First Design
- Responsive grid layouts that adapt to screen size
- Touch-friendly buttons and controls
- Collapsible filters on mobile
- Sticky header for easy navigation
- Optimized for slow connections

### Shopping Experience
- **Guest Checkout**: Shop without creating an account
- **Session Persistence**: Cart saved across sessions
- **Real-time Updates**: Cart count updates instantly
- **Smart Filters**: Filter by price, brand, rating, stock, and discounts
- **Multiple Sort Options**: Sort by popularity, price, rating, or newest

### Payment Methods
- **Pay on Delivery**: Cash or card payment upon delivery
- **M-Pesa Integration**: UI ready for M-Pesa integration (webhook endpoint included)

### Order Management
- **Status Tracking**: Visual timeline showing order progress
- **Email Notifications**: Ready for email integration
- **Admin Controls**: Update order status from admin dashboard

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products/[slug]` - Get product details
- `GET /api/categories/products` - Get products by category with filters
- `GET /api/search` - Search products

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart` - Remove cart item

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/[id]` - Get order details

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders` - Update order status

## Database Schema

### Users
- id, name, email, password_hash, role, created_at

### Categories
- id, name, slug, parent_id

### Products
- id, title, slug, price, discount, description, specs, brand, stock, rating_avg, rating_count, category_id, created_at

### Product Images
- id, product_id, url, is_primary

### Product Variants
- id, product_id, color, storage, size, sku, stock, price_override

### Carts
- id, user_id, session_id, created_at

### Cart Items
- id, cart_id, product_id, variant_id, qty

### Orders
- id, user_id, status, total, delivery_fee, address_json, payment_method, created_at

### Order Items
- id, order_id, product_id, variant_id, qty, price_at_purchase

### Reviews
- id, product_id, user_id, rating, comment, created_at

### Addresses
- id, user_id, name, phone, address_line, city, is_default

### Wishlist
- id, user_id, product_id, created_at

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Click "Deploy"

3. **Set Environment Variables** (optional)
   - `JWT_SECRET`: Your JWT secret key

### Other Platforms

The app can be deployed to:
- **Railway**: Supports SQLite and Node.js
- **Render**: Web service with persistent disk
- **DigitalOcean App Platform**: Node.js support
- **AWS Amplify**: Full-stack deployment

### Production Considerations

1. **Database**: For production, consider migrating to PostgreSQL
2. **File Storage**: Use S3 or Cloudinary for product images
3. **Email**: Integrate SendGrid or AWS SES for order notifications
4. **Payment**: Complete M-Pesa integration with real API keys
5. **Analytics**: Add Google Analytics or Mixpanel
6. **Monitoring**: Use Sentry for error tracking
7. **CDN**: Use Cloudflare or AWS CloudFront for static assets

## Customization

### Branding
- Update colors in `tailwind.config.js`
- Replace logo in `Header.tsx`
- Modify footer links in `Footer.tsx`

### Products
- Add more products via admin dashboard (future feature)
- Modify seed script in `scripts/seed.js`
- Update product categories

### Payment Integration
- Implement M-Pesa STK Push in `/api/orders`
- Add webhook handler for payment confirmation
- Update checkout flow with payment status

## Performance Optimization

- Server Components for faster initial load
- Image optimization with Next.js Image component (ready to implement)
- Database indexing on frequently queried fields
- API route caching for product listings
- Lazy loading for images and components

## Security Features

- Password hashing with bcryptjs
- JWT tokens stored in httpOnly cookies
- SQL injection prevention with prepared statements
- XSS protection with React's built-in escaping
- CSRF protection with SameSite cookies
- Role-based access control for admin routes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is open source and available for educational and commercial use.

## Support

For issues or questions:
1. Check the code comments for implementation details
2. Review the API endpoints documentation above
3. Examine the database schema for data structure

## Future Enhancements

- [ ] Product reviews and ratings submission
- [ ] Wishlist functionality
- [ ] Product comparison
- [ ] Live chat support
- [ ] Email notifications
- [ ] SMS notifications for orders
- [ ] Advanced admin product management
- [ ] Inventory management
- [ ] Sales analytics and reports
- [ ] Coupon and discount codes
- [ ] Multi-vendor support
- [ ] Social media integration
- [ ] PWA support for offline access

---

Built with ❤️ for the Kenyan market
