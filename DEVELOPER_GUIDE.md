# Ethiopian Handcraft Marketplace - Developer Guide

## Quick Start

### Project Setup
```bash
# Install dependencies
npm install
# or
pnpm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to see the application.

## Architecture Overview

### Folder Organization by Role + Functionality

The application is organized into **role-based sections** with clear separation of concerns:

```
app/
├── auth/          - Authentication (shared by all roles)
├── customer/      - Customer shopping interface
├── artisan/       - Artisan shop management
├── admin/         - Administrator control panel
└── agent/         - Verification & logistics agent
```

Each role section contains sub-folders by functionality:
- `dashboard/` - Role overview & analytics
- `products/` - Product management (artisan)
- `orders/` - Order tracking & management
- `users/` - User management (admin)
- `verification/` - Verification tasks (agent)
- etc.

## Styling Guide

### Color System
Three premium colors define the entire UI:

| Color | Hex | Usage | CSS Variable |
|-------|-----|-------|--------------|
| Black | #000000 | Primary actions, headers | `--primary` |
| Golden | #D4AF37 | Highlights, CTAs | `--secondary` |
| Golden | #D4AF37 | Accents, emphasis | `--accent` |

### Applying Colors

**Use Design Tokens (Recommended)**
```tsx
// DO THIS - Uses Tailwind tokens
<Button className="bg-primary text-primary-foreground">
  Save Changes
</Button>

<Card className="border-secondary">
  Featured Section
</Card>

<Badge className="bg-accent text-accent-foreground">
  Alert
</Badge>
```

**DO NOT use direct colors:**
```tsx
// DON'T DO THIS
<Button className="bg-[#1B5E20] text-white">
  Save
</Button>
```

### Responsive Breakpoints
```tsx
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* 1 column on mobile, 2 on tablet, 4 on desktop */}
</div>
```

## Component Usage

### Building New Pages

1. **Create in role folder**
```
app/artisan/products/add/page.tsx
```

2. **Use shared layout**
```tsx
'use client'

import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'

export default function AddProductPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page content */}
      </main>
      <Footer />
    </div>
  )
}
```

### Common shadcn/ui Components

```tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
```

### Creating a Role-Based Component

**Structure**: `/components/{role}/component-name.tsx`

```tsx
'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ArtisanProductCardProps {
  productId: number
  name: string
  price: string
  sales: number
}

export function ArtisanProductCard({
  productId,
  name,
  price,
  sales,
}: ArtisanProductCardProps) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold">{name}</h3>
      <p className="text-secondary font-bold">{price}</p>
      <p className="text-sm text-muted-foreground">{sales} sales</p>
      <Button className="bg-primary hover:bg-primary/90">
        Edit
      </Button>
    </Card>
  )
}
```

## Data Flow Patterns

### Current (Demo) Pattern
Currently, pages use mock data defined in the component:

```tsx
const mockOrders = [
  { id: 1, customer: 'Ahmed', total: '$150' },
  // ...
]
```

### Future: Server Actions & API Routes
```tsx
// Example of how to integrate API endpoints
const response = await fetch('/api/customer/orders')
const orders = await response.json()
```

### Future: Database Integration
```tsx
// Example with Supabase
import { createClient } from '@supabase/supabase-js'

const { data: orders } = await supabase
  .from('orders')
  .select('*')
  .eq('user_id', userId)
```

## Navigation Between Roles

### Login Page Routing
The login page at `/auth/login` handles role-based redirection:

```tsx
const dashboardMap: Record<UserRole, string> = {
  customer: '/customer/dashboard',
  artisan: '/artisan/dashboard',
  agent: '/agent/dashboard',
  admin: '/admin/dashboard',
}

window.location.href = dashboardMap[role]
```

### Creating Internal Links
```tsx
import Link from 'next/link'

<Link href="/artisan/products/add">
  <Button>Add Product</Button>
</Link>
```

## Table Component Usage

**Basic Table**
```tsx
import { Table } from '@/components/ui/table'

<div className="overflow-x-auto">
  <table className="w-full">
    <thead className="border-b border-border">
      <tr>
        <th className="text-left py-3 px-4">Column 1</th>
        <th className="text-left py-3 px-4">Column 2</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item) => (
        <tr key={item.id} className="border-b border-border hover:bg-muted/50">
          <td className="py-3 px-4">{item.field1}</td>
          <td className="py-3 px-4">{item.field2}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

## Form Handling

**Example Form Component**
```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function MyForm() {
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validation
    if (!formData.name) {
      setError('Name is required')
      return
    }

    // Submit logic
    console.log('Form submitted:', formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" className="bg-primary">
        Submit
      </Button>
    </form>
  )
}
```

## Status Badges

**Pattern for Status Colors**
```tsx
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-primary text-primary-foreground'
    case 'Processing':
      return 'bg-secondary text-secondary-foreground'
    case 'Pending':
      return 'bg-muted text-muted-foreground'
    case 'Cancelled':
      return 'bg-accent text-accent-foreground'
    default:
      return 'bg-border text-foreground'
  }
}

// Usage
<Badge className={getStatusColor(order.status)}>
  {order.status}
</Badge>
```

## TypeScript Tips

### Define Interface for Props
```tsx
interface DashboardCardProps {
  title: string
  value: string
  change: string
  icon: React.ReactNode
}

export function DashboardCard({
  title,
  value,
  change,
  icon,
}: DashboardCardProps) {
  // ...
}
```

### Use Enums for Status/Role
```tsx
enum OrderStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
}

type UserRole = 'customer' | 'artisan' | 'agent' | 'admin'
```

## Common Layout Patterns

### Dashboard Layout
```tsx
<div className="min-h-screen bg-background flex flex-col">
  <Header />
  <main className="flex-1">
    <div className="container mx-auto px-4 py-8">
      {/* Content */}
    </div>
  </main>
  <Footer />
</div>
```

### Grid Layout (Responsive)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Cards */}
</div>
```

### Two-Column Layout
```tsx
<div className="flex flex-col md:flex-row gap-6">
  <aside className="w-full md:w-64">
    {/* Sidebar */}
  </aside>
  <main className="flex-1">
    {/* Main content */}
  </main>
</div>
```

## Testing

### Manual Testing Checklist
- [ ] Test on mobile (use DevTools)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1024px+)
- [ ] Test light mode colors
- [ ] Test dark mode (if enabled)
- [ ] Test all navigation links
- [ ] Test form validation
- [ ] Test button hover states

## Performance Tips

1. **Use `next/image` for images** (future)
```tsx
import Image from 'next/image'

<Image
  src="/product.jpg"
  alt="Product"
  width={300}
  height={300}
/>
```

2. **Lazy load components** (future)
```tsx
const HeavyComponent = dynamic(() => import('./Heavy'), {
  loading: () => <div>Loading...</div>,
})
```

3. **Memoize expensive components** (future)
```tsx
export const MemoizedComponent = React.memo(MyComponent)
```

## Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Import repository in Vercel
3. Configure environment variables
4. Click Deploy

```bash
# Or deploy via CLI
npm i -g vercel
vercel
```

## Troubleshooting

### Colors not applying?
- Check if you're using design token variables (not hex codes)
- Verify `globals.css` has correct HSL values
- Clear `.next` folder: `rm -rf .next`

### TypeScript errors?
- Run: `npm run type-check`
- Check component imports
- Verify interface definitions

### Styling not responsive?
- Use mobile-first approach (no prefix for mobile)
- Add breakpoints: `md:`, `lg:`, `xl:`
- Test in DevTools

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Documentation](https://react.dev)

---

**Last Updated**: 2024 | **Version**: 1.0
