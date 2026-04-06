# Ethiopian Handcraft Marketplace - Project Structure

## Overview
This is a Next.js 16 application with TypeScript and shadcn/ui components, organized by role and functionality. The marketplace supports four main user roles: Customer, Artisan, Agent, and Administrator.

## Color Palette
- **Primary (Black)**: #000000 - Elegance & Sophistication
- **Secondary (Golden)**: #D4AF37 - Luxury & Prestige
- **Accent (Golden)**: #D4AF37 - Highlights & Focus
- **Neutrals**: White, grays for readability and contrast

## Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx              # Root layout with metadata & viewport
│   ├── globals.css             # Global styles with Golden, White & Black color tokens
│   ├── page.tsx                # Public homepage with featured products
│   │
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx        # Role-based login page
│   │   └── register/
│   │       └── page.tsx        # Role selection & account creation
│   │
│   ├── customer/               # CUSTOMER ROLE PAGES
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Customer dashboard (orders, wishlist, account)
│   │   ├── orders/
│   │   │   ├── page.tsx        # Order history & tracking
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Order detail view
│   │   └── profile/
│   │       └── page.tsx        # Customer profile & settings
│   │
│   ├── artisan/                # ARTISAN ROLE PAGES
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Artisan dashboard (sales, orders, products)
│   │   ├── products/
│   │   │   ├── page.tsx        # Product listing & management
│   │   │   ├── add/
│   │   │   │   └── page.tsx    # Add new product form
│   │   │   └── [id]/
│   │   │       ├── page.tsx    # Product detail & edit
│   │   │       └── analytics/
│   │   │           └── page.tsx # Product analytics & sales
│   │   ├── orders/
│   │   │   ├── page.tsx        # Order management
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Order detail & shipping
│   │   ├── shop/
│   │   │   └── page.tsx        # Shop settings & branding
│   │   └── profile/
│   │       └── page.tsx        # Artisan profile & bank info
│   │
│   ├── admin/                  # ADMINISTRATOR ROLE PAGES
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Admin dashboard (KPIs, approvals, users)
│   │   ├── users/
│   │   │   ├── page.tsx        # User management
│   │   │   └── [id]/
│   │   │       └── page.tsx    # User detail & actions
│   │   ├── products/
│   │   │   ├── page.tsx        # Product approval & management
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Product detail & verification
│   │   ├── orders/
│   │   │   ├── page.tsx        # Global order management
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Order detail & interventions
│   │   ├── reports/
│   │   │   └── page.tsx        # Analytics, exports, reports
│   │   └── settings/
│   │       └── page.tsx        # Site configuration & branding
│   │
│   ├── agent/                  # AGENT ROLE PAGES
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Agent dashboard (tasks, shipments)
│   │   ├── verification/
│   │   │   ├── page.tsx        # Verification tasks list
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Verification detail & review
│   │   ├── shipments/
│   │   │   ├── page.tsx        # Shipment tracking
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Shipment detail & updates
│   │   ├── reports/
│   │   │   └── page.tsx        # Agent performance reports
│   │   └── profile/
│   │       └── page.tsx        # Agent profile & assignment
│   │
│   └── api/                    # API ROUTES (Future)
│       ├── auth/
│       │   ├── route.ts        # Authentication endpoints
│       │   └── logout/
│       │       └── route.ts
│       ├── customer/
│       ├── artisan/
│       ├── admin/
│       ├── agent/
│       └── products/
│
├── components/
│   ├── shared/                 # SHARED COMPONENTS (All roles)
│   │   ├── header.tsx          # Top navigation with search & cart
│   │   ├── footer.tsx          # Footer with links & social
│   │   ├── sidebar.tsx         # Role-based sidebar (future)
│   │   └── breadcrumb.tsx      # Navigation breadcrumbs (future)
│   │
│   ├── customer/               # CUSTOMER-SPECIFIC COMPONENTS
│   │   ├── product-card.tsx    # Reusable product card
│   │   ├── cart-item.tsx       # Shopping cart item
│   │   ├── order-summary.tsx   # Order summary widget
│   │   └── wishlist-item.tsx   # Wishlist item component
│   │
│   ├── artisan/                # ARTISAN-SPECIFIC COMPONENTS
│   │   ├── product-form.tsx    # Product submission form
│   │   ├── order-details.tsx   # Order detail with shipping
│   │   ├── sales-chart.tsx     # Sales analytics chart
│   │   └── inventory-card.tsx  # Inventory status card
│   │
│   ├── admin/                  # ADMIN-SPECIFIC COMPONENTS
│   │   ├── approval-card.tsx   # Approval task card
│   │   ├── user-table.tsx      # User management table
│   │   ├── analytics-chart.tsx # Analytics visualization
│   │   └── status-badge.tsx    # Status indicators
│   │
│   ├── agent/                  # AGENT-SPECIFIC COMPONENTS
│   │   ├── verification-form.tsx # Verification review form
│   │   ├── shipment-tracker.tsx  # Shipment tracking widget
│   │   └── task-card.tsx        # Verification task card
│   │
│   └── ui/                     # SHADCN UI COMPONENTS
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── badge.tsx
│       ├── tabs.tsx
│       ├── table.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── alert.tsx
│       ├── avatar.tsx
│       ├── dropdown-menu.tsx
│       ├── pagination.tsx
│       ├── sidebar.tsx
│       └── ... (20+ more shadcn components)
│
├── lib/
│   └── utils.ts                # Utility functions & cn() helper
│
├── hooks/
│   ├── use-mobile.ts           # Mobile detection hook
│   └── use-toast.ts            # Toast notifications hook
│
├── public/
│   ├── placeholder.svg
│   ├── placeholder.jpg
│   ├── icon.svg
│   └── ... (favicons & icons)
│
├── styles/
│   └── globals.css             # Global base styles
│
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── next.config.mjs             # Next.js configuration
├── package.json                # Dependencies
├── components.json             # shadcn CLI config
├── postcss.config.mjs          # PostCSS configuration
└── PROJECT_STRUCTURE.md        # This file

```

## User Roles & Access Paths

### 1. **Customer Role** (`/customer/`)
- **Access**: Browse & purchase products
- **Key Pages**:
  - Dashboard: View orders, wishlist, profile
  - Orders: Manage order history & track shipments
  - Profile: Update account & address settings
- **Features**: Shopping cart, wishlist, order tracking, reviews

### 2. **Artisan Role** (`/artisan/`)
- **Access**: Manage shop & sell products
- **Key Pages**:
  - Dashboard: Sales overview, order management, product stats
  - Products: List, add, edit products with images
  - Orders: View customer orders & update shipping status
  - Shop: Manage shop branding & payment methods
  - Profile: Update artisan info & banking details
- **Features**: Product management, sales analytics, order fulfillment

### 3. **Administrator Role** (`/admin/`)
- **Access**: Oversee entire marketplace
- **Key Pages**:
  - Dashboard: KPIs, pending approvals, recent activity
  - Users: Manage all users (customers, artisans, agents)
  - Products: Approve/reject product listings
  - Orders: Monitor all orders, refund capabilities
  - Reports: Analytics, export data, top categories
  - Settings: Site configuration, payment gateway, branding
- **Features**: User management, content moderation, analytics

### 4. **Agent Role** (`/agent/`)
- **Access**: Handle verification & logistics
- **Key Pages**:
  - Dashboard: Pending tasks, shipment overview
  - Verification: Review artisan documents & product authenticity
  - Shipments: Track orders, update delivery status
  - Reports: Performance metrics & task history
  - Profile: Assigned region & performance stats
- **Features**: Task management, shipment tracking, verification

## Styling & Theme System

### Design Tokens (from `globals.css`)
```css
--primary: Deep Green (#1B5E20) - Main actions
--secondary: Warm Gold (#D4AF37) - Highlights & accents
--accent: Deep Red (#8B0000) - Alerts & emphasis
--background: Light off-white (98%)
--foreground: Dark green (primary variant)
```

### Component Styling
- All UI components use **shadcn/ui** built on **Tailwind CSS**
- Mobile-first responsive design with breakpoints (sm, md, lg)
- Flexbox for layouts, CSS Grid for complex 2D layouts
- Semantic HTML with proper ARIA attributes
- Color contrast ensures WCAG compliance

## Key Technologies

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Lucide Icons** - Modern icon library
- **React Hooks** - State management (useState, useEffect, etc.)

## Future Enhancements

1. **Database Integration** - Connect Supabase/Neon for data persistence
2. **Authentication** - Implement role-based access control with Auth.js
3. **API Routes** - Build backend endpoints for CRUD operations
4. **Payment Integration** - Add Stripe for payments
5. **File Uploads** - Integrate Vercel Blob for product images
6. **Real-time Updates** - Add WebSocket for order notifications
7. **Search & Filters** - Implement product search & advanced filtering
8. **Reviews & Ratings** - Add customer review system
9. **Email Notifications** - Automated order & account emails
10. **Analytics Dashboard** - Detailed metrics & KPIs

## Getting Started

1. Install dependencies: `npm install` or `pnpm install`
2. Run development server: `npm run dev`
3. Open `http://localhost:3000` in your browser
4. Navigate between roles using login/register pages

## Development Notes

- All pages are organized by role first, then functionality
- Shared components go in `/components/shared/`
- Role-specific components go in `/components/{role}/`
- Use TypeScript interfaces for type safety
- Follow the existing component patterns for consistency
- Test responsiveness at mobile (320px), tablet (768px), desktop (1024px)

---

**Built with Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui**
