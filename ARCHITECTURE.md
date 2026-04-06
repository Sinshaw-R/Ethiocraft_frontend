# Ethiopian Handcraft Marketplace - Architecture Diagram

## Application Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      PUBLIC PAGES (No Auth)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐        ┌──────────────┐        ┌──────────┐  │
│  │  Homepage    │───────▶│  Auth Pages  │◀──────▶│  Header  │  │
│  │  (/)         │        │  (Login,     │        │  (All)   │  │
│  │              │        │   Register)  │        │          │  │
│  └──────────────┘        └──────────────┘        └──────────┘  │
│                                │                       │        │
│                          Role Selection                │        │
│                                │                       │        │
└────────────┬───────────────────┼───────────────────────┼────────┘
             │                   │                       │
      ┌──────▼─────┬─────────┬──▼───────┬────────────┬───▼──────┐
      │             │         │          │            │          │
 ┌────▼───┐ ┌──────▼──┐ ┌───▼────┐ ┌──▼────┐    ┌──▼────┐    │
 │Customer │ │ Artisan │ │ Admin  │ │ Agent │    │Footer │    │
 │ Role    │ │  Role   │ │ Role   │ │ Role  │    │(All)  │    │
 └────┬────┘ └────┬────┘ └───┬────┘ └───┬───┘    └───────┘    │
      │           │          │          │                      │
      ▼           ▼          ▼          ▼                      │
```

## Role-Based Access Control

```
                      ┌─────────────────────────────────┐
                      │    Ethiopian Handcraft Market   │
                      └─────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
            ┌───────▼────┐  ┌──────▼─────┐  ┌─────▼──────┐
            │   Public    │  │   Auth     │  │  Shared    │
            │   Pages     │  │   System   │  │ Components │
            ├─────────────┤  ├────────────┤  ├────────────┤
            │ • Homepage  │  │ • Login    │  │ • Header   │
            │ • Category  │  │ • Register │  │ • Footer   │
            │ • Products  │  │ • Redirect │  │ • Layout   │
            └─────────────┘  └────────────┘  └────────────┘
                    │              │              │
                    └──────┬───────┴──────┬───────┘
                           │              │
            ┌──────────────┴──────────────┴──────────────┬──────────┐
            │                                            │          │
      ┌─────▼────────────┐                     ┌────────▼─────┐   │
      │  CUSTOMER ROLE   │                     │ ARTISAN ROLE │   │
      ├──────────────────┤                     ├──────────────┤   │
      │ /customer/       │                     │ /artisan/    │   │
      │ ├─ dashboard/    │                     │ ├─ dashboard/│   │
      │ │  • Stats       │                     │ │ • Sales    │   │
      │ │  • Orders      │                     │ │ • Products │   │
      │ │  • Wishlist    │                     │ │ • Orders   │   │
      │ │  • Profile     │                     │ │ • Shop     │   │
      │ ├─ orders/       │                     │ ├─ products/ │   │
      │ └─ profile/      │                     │ ├─ orders/   │   │
      │                  │                     │ └─ shop/     │   │
      └──────────────────┘                     └──────────────┘   │
                                                                   │
      ┌──────────────────────┐        ┌──────────────────────┐   │
      │   ADMIN ROLE         │        │   AGENT ROLE         │   │
      ├──────────────────────┤        ├──────────────────────┤   │
      │ /admin/              │        │ /agent/              │   │
      │ ├─ dashboard/        │        │ ├─ dashboard/        │   │
      │ │ • KPIs             │        │ │ • Tasks            │   │
      │ │ • Approvals        │        │ │ • Shipments        │   │
      │ │ • Users            │        │ │ • Performance      │   │
      │ ├─ users/            │        │ ├─ verification/     │   │
      │ ├─ products/         │        │ ├─ shipments/        │   │
      │ ├─ orders/           │        │ └─ reports/          │   │
      │ └─ reports/          │        └──────────────────────┘   │
      └──────────────────────┘                                    │
            │                          │
            └──────────────┬───────────┘
                           │
                    (Future) API Routes
                    /api/{role}/*
```

## Component Hierarchy

```
┌─ Layout (Root)
│  │
│  ├─ Header (Shared)
│  │  ├─ Logo
│  │  ├─ Search
│  │  ├─ Cart Icon
│  │  └─ Auth Buttons
│  │
│  ├─ Main Content
│  │  │
│  │  ├─ Role Dashboards
│  │  │  ├─ Stats Cards
│  │  │  │  ├─ Icon
│  │  │  │  ├─ Title
│  │  │  │  ├─ Value
│  │  │  │  └─ Change
│  │  │  │
│  │  │  ├─ Tabs
│  │  │  │  ├─ Tab 1 Content
│  │  │  │  ├─ Tab 2 Content
│  │  │  │  └─ Tab 3 Content
│  │  │  │
│  │  │  ├─ Tables
│  │  │  │  ├─ Header
│  │  │  │  └─ Rows with Badges
│  │  │  │
│  │  │  └─ Grids
│  │  │     ├─ Product Cards
│  │  │     ├─ Wishlist Items
│  │  │     └─ User Cards
│  │  │
│  │  └─ Forms
│  │     ├─ Input Fields
│  │     ├─ Validation
│  │     └─ Submit Button
│  │
│  └─ Footer (Shared)
│     ├─ Links
│     ├─ Social
│     └─ Copyright
│
└─ Global Styles
   └─ Design Tokens (Colors)
```

## Data Flow (Current & Future)

### Current (Mock Data)
```
┌──────────────┐
│ Component    │
│ (Page.tsx)   │
├──────────────┤
│ Mock Data    │
│ Defined in   │
│ Component    │
└──────────────┘
        │
        ▼
┌──────────────────────┐
│ Display/Render       │
│ (UI Components)      │
└──────────────────────┘
```

### Future (With API)
```
┌──────────────┐
│ Component    │
│ (Page.tsx)   │
├──────────────┤
│ useEffect()  │ 
│ fetch API    │
└──────────────┘
        │
        ▼
┌──────────────────────┐
│ API Route            │
│ (/api/endpoint)      │
├──────────────────────┤
│ Business Logic       │
│ Validation           │
│ Auth Check           │
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│ Database             │
│ (Supabase/Neon)      │
├──────────────────────┤
│ Tables:              │
│ • users              │
│ • products           │
│ • orders             │
│ • reviews            │
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│ API Response         │
│ (JSON)               │
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│ Display/Render       │
│ (UI Components)      │
└──────────────────────┘
```

## Routing Structure

```
Next.js App Router Hierarchy:

/                                    (Public Home)
├── /auth
│   ├── /login                        (Role-based Login)
│   └── /register                     (Account Creation)
│
├── /customer                         (Customer Dashboard)
│   ├── /dashboard                    (Overview)
│   ├── /orders                       (Order History)
│   │   └── /[id]                     (Order Detail)
│   └── /profile                      (Settings)
│
├── /artisan                          (Artisan Dashboard)
│   ├── /dashboard                    (Overview)
│   ├── /products                     (Product List)
│   │   ├── /add                      (Add Product)
│   │   └── /[id]                     (Product Detail)
│   ├── /orders                       (Order Management)
│   │   └── /[id]                     (Order Detail)
│   ├── /shop                         (Shop Settings)
│   └── /profile                      (Artisan Info)
│
├── /admin                            (Admin Dashboard)
│   ├── /dashboard                    (Overview)
│   ├── /users                        (User Management)
│   │   └── /[id]                     (User Detail)
│   ├── /products                     (Product Approval)
│   │   └── /[id]                     (Product Detail)
│   ├── /orders                       (Order Management)
│   │   └── /[id]                     (Order Detail)
│   └── /reports                      (Analytics)
│
└── /agent                            (Agent Dashboard)
    ├── /dashboard                    (Overview)
    ├── /verification                 (Verification Tasks)
    │   └── /[id]                     (Task Detail)
    ├── /shipments                    (Shipment Tracking)
    │   └── /[id]                     (Shipment Detail)
    └── /reports                      (Performance Reports)
```

## Component Organization

```
components/
│
├── shared/                           (All Roles)
│   ├── header.tsx                    ✓ Navigation & Search
│   ├── footer.tsx                    ✓ Site Footer
│   ├── sidebar.tsx                   (Future)
│   └── breadcrumb.tsx                (Future)
│
├── customer/                         (Customer-Specific)
│   ├── product-card.tsx              (Future)
│   ├── cart-item.tsx                 (Future)
│   ├── order-summary.tsx             (Future)
│   └── wishlist-item.tsx             (Future)
│
├── artisan/                          (Artisan-Specific)
│   ├── product-form.tsx              (Future)
│   ├── order-details.tsx             (Future)
│   ├── sales-chart.tsx               (Future)
│   └── inventory-card.tsx            (Future)
│
├── admin/                            (Admin-Specific)
│   ├── approval-card.tsx             (Future)
│   ├── user-table.tsx                (Future)
│   ├── analytics-chart.tsx           (Future)
│   └── status-badge.tsx              (Future)
│
├── agent/                            (Agent-Specific)
│   ├── verification-form.tsx         (Future)
│   ├── shipment-tracker.tsx          (Future)
│   └── task-card.tsx                 (Future)
│
└── ui/                               (shadcn/ui)
    ├── button.tsx                    ✓
    ├── card.tsx                      ✓
    ├── input.tsx                     ✓
    ├── label.tsx                     ✓
    ├── badge.tsx                     ✓
    ├── tabs.tsx                      ✓
    ├── table.tsx                     ✓
    ├── form.tsx                      ✓
    ├── alert.tsx                     ✓
    ├── dialog.tsx                    ✓
    ├── avatar.tsx                    ✓
    └── ... (20+ more)                ✓
```

## Color System Architecture

```
┌─────────────────────────────────────────────┐
│         Global CSS Variables                │
│         (app/globals.css)                   │
└─────────────────────────────────────────────┘
            │
            ├─ Light Mode
            │  ├─ --primary: hsl(120, 65%, 20%)
            │  ├─ --secondary: hsl(45, 75%, 60%)
            │  ├─ --accent: hsl(0, 100%, 27%)
            │  ├─ --background: hsl(0, 0%, 98%)
            │  └─ --foreground: hsl(120, 43%, 10%)
            │
            └─ Dark Mode (.dark class)
               ├─ --primary: hsl(45, 75%, 60%)
               ├─ --secondary: hsl(120, 65%, 20%)
               ├─ --accent: hsl(0, 100%, 60%)
               ├─ --background: hsl(120, 43%, 8%)
               └─ --foreground: hsl(45, 75%, 70%)
                    │
                    ▼
        ┌──────────────────────────────┐
        │ Tailwind Config Extensions   │
        │ (tailwind.config.ts)         │
        └──────────────────────────────┘
                    │
                    ├─ bg-primary
                    ├─ text-secondary
                    ├─ border-accent
                    └─ hover:bg-primary/90
                        │
                        ▼
            ┌────────────────────────┐
            │ Components Use Colors  │
            │ (UI & Pages)           │
            └────────────────────────┘
```

## Responsive Design Breakpoints

```
Mobile-First Approach:

┌─────────────────────────────────────────────┐
│ Default (Mobile - 320px+)                   │
│                                             │
│ • Single column layout                      │
│ • Full-width buttons                        │
│ • Hamburger menu                            │
│ • Stack everything vertically               │
└─────────────────────────────────────────────┘
        │
        │ @media (min-width: 640px)
        ▼
┌─────────────────────────────────────────────┐
│ sm: (Small - 640px+)                        │
│ • Minor adjustments                         │
│ • Better spacing                            │
└─────────────────────────────────────────────┘
        │
        │ @media (min-width: 768px)
        ▼
┌─────────────────────────────────────────────┐
│ md: Tablet (768px+)                         │
│                                             │
│ • Two-column layouts                        │
│ • Horizontal navigation                     │
│ • Side-by-side cards                        │
│ • Table displays                            │
└─────────────────────────────────────────────┘
        │
        │ @media (min-width: 1024px)
        ▼
┌─────────────────────────────────────────────┐
│ lg: Desktop (1024px+)                       │
│                                             │
│ • Multi-column grids (3-4 cols)             │
│ • Full header with all elements             │
│ • Optimal reading width                     │
│ • All features visible                      │
└─────────────────────────────────────────────┘
        │
        │ @media (min-width: 1280px)
        ▼
┌─────────────────────────────────────────────┐
│ xl: Large Desktop (1280px+)                 │
│ • Extra spacing                             │
│ • Maximum content width                     │
└─────────────────────────────────────────────┘
```

## Technology Stack Layers

```
┌──────────────────────────────────────────┐
│  User Interface Layer                    │
│  (Pages, Components, Forms)              │
└──────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────┐
│  State Management Layer                  │
│  (React Hooks, Context)                  │
└──────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────┐
│  Component Library Layer                 │
│  (shadcn/ui, Lucide Icons)               │
└──────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────┐
│  Styling Layer                           │
│  (Tailwind CSS, Design Tokens)           │
└──────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────┐
│  Framework Layer                         │
│  (Next.js 16, React 19)                  │
└──────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────┐
│  Runtime                                 │
│  (Node.js / Browser)                     │
└──────────────────────────────────────────┘
```

---

**This architecture supports scalable, maintainable development of the Ethiopian Handcraft Marketplace.**
