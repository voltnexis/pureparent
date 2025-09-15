# PureParent - Baby Products E-commerce Platform

A modern, mobile-first e-commerce platform for baby products with AI-powered recommendations, expert consultations, and personalized experiences.

## 🚀 Features

### 🎨 Modern Design
- Vibrant color scheme (Coral Red #FF6B6B + Turquoise #4ECDC4)
- Mobile-first responsive design
- Clean navigation with essential items only
- Gradient backgrounds and smooth animations

### 🔐 Authentication & Profiles
- Email/Password and Google OAuth sign-in
- Baby profile setup with milestone tracking
- Personalized recommendations based on baby's age
- Secure user data with Supabase RLS

### 🛍️ Shopping Experience
- Real-time product data from Supabase
- AI-powered quality scoring (0-100)
- Age-appropriate product filtering
- Smart search with suggestions
- Persistent cart across sessions

### 👩⚕️ Expert Consultations
- Video/chat consultations with verified experts
- Pediatricians, lactation consultants, sleep coaches
- Pre-consultation forms and follow-up reports
- Secure payment integration

### 🎂 Special Features
- AI-generated birthday wishes and packs
- Milestone tracking with product recommendations
- Real reviews from verified purchases
- WhatsApp support integration

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: PostgreSQL with Row Level Security
- **Storage**: Supabase Storage for images
- **Payments**: Ready for Razorpay/Stripe integration

## 📁 Project Structure

```
pureparent/
├── index.html             # Homepage with hero, categories, products
├── auth.html              # Authentication (Sign in/up)
├── profile-setup.html     # Baby profile setup
├── dashboard.html         # Main dashboard
├── shop.html             # Product catalog with filters
├── product.html          # Product details
├── cart.html             # Shopping cart
├── orders.html           # Order history
├── wishlist.html         # Saved products
├── profile.html          # User profile
├── help.html             # Help & support
├── expert-booking.html   # Expert consultations
├── birthday-pack.html    # Birthday pack creator
├── styles.css            # Main stylesheet (mobile-first)
├── additional-styles.css # Additional component styles
├── auth.css              # Authentication styles
├── help-styles.css       # Help page styles
├── supabase-config.js    # Database configuration
├── supabase-schema.sql   # Database schema
├── database-fix-final.sql # Database fixes
├── setup-database.js     # Initial data setup
├── script.js             # Homepage functionality
├── shop.js               # Shop page functionality
├── dashboard.js          # Dashboard functionality
├── auth.js               # Authentication logic
├── cart.js               # Cart functionality
├── orders.js             # Orders functionality
├── quality-score.js      # Product quality scoring
└── img/                  # Images (logo2.png, placeholder.jpg)
```

## 🚀 Setup Instructions

### 1. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Update `supabase-config.js` with your credentials
4. Run the database setup in Supabase SQL Editor:
   ```sql
   -- First run: supabase-schema.sql (complete schema)
   -- Then run: database-fix-final.sql (fixes and optimizations)
   ```

### 2. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add your domain to authorized origins
4. Enable Google OAuth in Supabase Auth settings

### 3. Database Population
1. Open browser console on any page
2. Run: `setupDatabase()` (uncomment in setup-database.js)
3. This will populate sample products and experts

### 4. Product Images
- Add product images to `/img/` folder
- Update image paths in database
- Images should be optimized for web (WebP recommended)

## 🔧 Configuration

### Supabase Configuration
Update `supabase-config.js`:
```javascript
const SUPABASE_URL = 'your-project-url';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

### Environment Variables (Optional)
For production, consider using environment variables:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `GOOGLE_CLIENT_ID`

## 📱 Navigation Structure

### Top Navigation
- Logo (left)
- Search icon
- Cart with count
- Profile avatar

### Bottom Navigation (Mobile)
- Home (Dashboard)
- Shop (Products)
- Orders (Order history)
- Wishlist (Saved items)
- Profile (User settings)

## 🎯 Key User Flows

### 1. New User Journey
1. Land on auth.html
2. Sign up with email or Google
3. Complete baby profile (optional)
4. Explore dashboard with recommendations
5. Shop age-appropriate products

### 2. Shopping Flow
1. Browse products by category/age
2. View product details with quality score
3. Add to cart
4. Secure checkout with multiple payment options
5. Track order status

### 3. Expert Consultation
1. Choose expert type (pediatrician, lactation, sleep)
2. Fill pre-consultation form
3. Book time slot
4. Pay consultation fee
5. Attend video/chat session
6. Receive follow-up report

## 🔒 Security Features

- Row Level Security (RLS) on all user data
- JWT-based authentication
- Secure password hashing
- Input validation and sanitization
- HTTPS enforcement (production)

## 📊 Database Schema

### Core Tables
- `profiles` - User profiles and preferences
- `babies` - Baby information and milestones
- `products` - Product catalog with quality scores
- `orders` - Order history and tracking
- `reviews` - User reviews with photos
- `experts` - Verified expert profiles
- `consultations` - Expert consultation records

### Features Tables
- `wishlist` - Saved products
- `cart_items` - Persistent cart
- `notifications` - User notifications
- `birthday_events` - Birthday pack orders
- `ai_recommendations` - AI-generated suggestions

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Netlify
1. Drag and drop build folder
2. Configure redirects for SPA
3. Set environment variables

### Traditional Hosting
1. Upload files to web server
2. Configure HTTPS
3. Set up domain and DNS

## ✅ **CURRENT STATUS - PRODUCTION READY**

### **Fixed Issues:**
- ✅ Mobile responsive design (2-column categories as requested)
- ✅ Header alignment issues resolved
- ✅ Search bar properly aligned on all pages
- ✅ Shop page stability - no more hanging/bugs
- ✅ Consistent navigation across all pages
- ✅ Logo updated to logo2.png everywhere
- ✅ Database schema optimized
- ✅ Clean file structure (removed redundant files)

### **Deleted Redundant Files:**
- ❌ login.html (replaced by auth.html)
- ❌ onboarding.html + onboarding.css + onboarding.js (replaced by profile-setup.html)
- ❌ dashboard.css (consolidated into styles.css)
- ❌ fix-babies-table.sql + fix-database.sql (consolidated into database-fix-final.sql)
- ❌ img/logo.png (using logo2.png consistently)

## 🔮 Future Enhancements

- [ ] Push notifications for milestones
- [ ] Subscription boxes for recurring orders
- [ ] AR try-on for clothes and toys
- [ ] Multi-language support (Hindi, regional)
- [ ] Offline mode with service workers
- [ ] Advanced AI recommendations
- [ ] Social features (parent community)
- [ ] Loyalty program and rewards

## 📞 Support

For technical support or questions:
- Email: support@pureparent.com
- WhatsApp: +91 98765 43210
- Documentation: [Link to docs]

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ for Indian parents and their little ones.