# Quick Reference - Ethiopian Handcraft Marketplace

## File Location Guide

### Public Pages
```
/ (homepage)                          → app/page.tsx
/auth/login                          → app/auth/login/page.tsx
/auth/register                       → app/auth/register/page.tsx
```

### Customer Pages
```
/customer/dashboard                  → app/customer/dashboard/page.tsx
/customer/orders                     → app/customer/dashboard/page.tsx (tab)
/customer/profile                    → app/customer/dashboard/page.tsx (tab)
```

### Artisan Pages
```
/artisan/dashboard                   → app/artisan/dashboard/page.tsx
/artisan/products                    → app/artisan/dashboard/page.tsx (tab)
/artisan/products/add                → app/artisan/products/add/page.tsx (future)
/artisan/orders                      → app/artisan/dashboard/page.tsx (tab)
/artisan/shop                        → app/artisan/dashboard/page.tsx (tab)
```

### Admin Pages
```
/admin/dashboard                     → app/admin/dashboard/page.tsx
/admin/users                         → app/admin/dashboard/page.tsx (tab)
/admin/products                      → app/admin/dashboard/page.tsx (tab)
/admin/orders                        → app/admin/dashboard/page.tsx (tab)
/admin/reports                       → app/admin/dashboard/page.tsx (tab)
```

### Agent Pages
```
/agent/dashboard                     → app/agent/dashboard/page.tsx
/agent/verification                  → app/agent/dashboard/page.tsx (tab)
/agent/shipments                     → app/agent/dashboard/page.tsx (tab)
/agent/reports                       → app/agent/dashboard/page.tsx (tab)
```

### Shared Components
```
Header                               → components/shared/header.tsx
Footer                               → components/shared/footer.tsx
Button, Card, Input, etc.           → components/ui/*.tsx
```

## Color Quick Reference

```css
/* Primary (Black) */
bg-primary, text-primary, border-primary
rgb(0, 0, 0) | #000000

/* Secondary (Golden) */
bg-secondary, text-secondary, border-secondary
rgb(212, 175, 55) | #D4AF37

/* Accent (Golden) */
bg-accent, text-accent, border-accent
rgb(212, 175, 55) | #D4AF37

/* Neutral (White/Gray) */
bg-background, text-foreground (White/Black)
bg-muted, text-muted-foreground (Light Gray/Dark Gray)
bg-card, text-card-foreground (White/Black)
```

## Tailwind Classes Cheat Sheet

### Layout
```tsx
flex                     // Flexbox container
flex-col                 // Stack vertically
flex-row                 // Stack horizontally (default)
gap-4                    // Space between items
items-center             // Vertical align center
justify-between          // Space items apart
w-full                   // 100% width
h-screen                 // Full viewport height
```

### Responsive
```tsx
md:                      // Tablet breakpoint (768px)
lg:                      // Desktop breakpoint (1024px)
md:flex-row              // Apply class on tablet+
md:grid-cols-2           // 2 columns on tablet+
```

### Spacing
```tsx
p-4                      // Padding: 16px
px-4                     // Horizontal padding
py-2                     // Vertical padding
m-4                      // Margin
mx-auto                  // Center horizontally
```

### Text
```tsx
text-lg                  // Large text
font-bold                // Bold
text-center              // Center align
line-clamp-2             // Max 2 lines
text-balance             // Better line breaks
```

### Colors
```tsx
bg-primary               // Deep green background
text-secondary           // Gold text
border-accent            // Red border
hover:bg-primary/90      // 90% opacity on hover
```

## Component Import Examples

```tsx
// Buttons
import { Button } from '@/components/ui/button'

// Forms
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select } from '@/components/ui/select'

// Containers
import { Card } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { Tabs } from '@/components/ui/tabs'

// Feedback
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

// Media
import { Avatar } from '@/components/ui/avatar'
import { Table } from '@/components/ui/table'

// Shared
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
```

## Code Snippets

### Button with Icon
```tsx
import { ArrowRight } from 'lucide-react'

<Button className="gap-2">
  Next Step
  <ArrowRight className="w-4 h-4" />
</Button>
```

### Status Badge
```tsx
<Badge className="bg-primary text-primary-foreground">
  Active
</Badge>
```

### Card with Icon
```tsx
<Card className="p-6">
  <div className="flex items-start justify-between">
    <div>
      <p className="text-sm text-muted-foreground">Total Sales</p>
      <p className="text-2xl font-bold">$5,420</p>
    </div>
    <TrendingUp className="w-8 h-8 text-secondary opacity-20" />
  </div>
</Card>
```

### Form with Validation
```tsx
const [error, setError] = useState('')

const handleSubmit = (e) => {
  e.preventDefault()
  setError('')
  
  if (!formData.email) {
    setError('Email is required')
    return
  }
  
  // Process form
}

<form onSubmit={handleSubmit}>
  {error && <Alert variant="destructive">{error}</Alert>}
  <Input type="email" required />
  <Button type="submit">Submit</Button>
</form>
```

### Responsive Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {items.map((item) => (
    <Card key={item.id}>{item.name}</Card>
  ))}
</div>
```

### Tabs Component
```tsx
<Tabs defaultValue="orders">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="orders">Orders</TabsTrigger>
    <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
    <TabsTrigger value="account">Account</TabsTrigger>
  </TabsList>
  
  <TabsContent value="orders">
    {/* Orders content */}
  </TabsContent>
  
  <TabsContent value="wishlist">
    {/* Wishlist content */}
  </TabsContent>
</Tabs>
```

## TypeScript Patterns

### Component Props Interface
```tsx
interface UserCardProps {
  id: number
  name: string
  email: string
  role: 'customer' | 'artisan' | 'agent' | 'admin'
  status: 'active' | 'inactive' | 'suspended'
}

export function UserCard(props: UserCardProps) {
  return <div>{props.name}</div>
}
```

### State with TypeScript
```tsx
interface FormData {
  name: string
  email: string
  message: string
}

const [formData, setFormData] = useState<FormData>({
  name: '',
  email: '',
  message: '',
})
```

## Key Patterns

### Dashboard Layout
1. Header (navigation)
2. Welcome section with heading
3. Summary cards grid (KPIs)
4. Tabs for different sections
5. Tables or cards for data
6. Footer

### Form Layout
1. Form title & description
2. Error alert (if any)
3. Form fields with labels
4. Submit button
5. Helper text/links

### Data Table Layout
```tsx
<div className="overflow-x-auto">
  <table className="w-full">
    <thead className="border-b border-border">
      <tr>
        <th className="text-left py-3 px-4">Column</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item) => (
        <tr key={item.id} className="border-b border-border hover:bg-muted/50">
          <td className="py-3 px-4">{item.field}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Colors not showing | Use design tokens: `bg-primary` not `bg-[#1B5E20]` |
| Not responsive | Add breakpoints: `md:flex-row` |
| Icons not rendering | Import from `lucide-react` |
| TypeScript errors | Define interfaces for component props |
| Table overflow on mobile | Wrap in `overflow-x-auto` |
| Styling conflicts | Check selector specificity in globals.css |

## Development Workflow

1. **Create new page**
   ```bash
   app/{role}/{feature}/page.tsx
   ```

2. **Add shared component**
   ```bash
   components/shared/component-name.tsx
   ```

3. **Add role-specific component**
   ```bash
   components/{role}/component-name.tsx
   ```

4. **Import components**
   ```tsx
   import { ComponentName } from '@/components/...'
   ```

5. **Test responsive design**
   - F12 → Toggle Device Toolbar
   - Test at 320px, 768px, 1024px

## Useful Commands

```bash
# Development
npm run dev                    # Start dev server

# Build & test
npm run build                  # Build for production
npm run start                  # Run production build
npm run type-check            # Check TypeScript errors

# Linting
npm run lint                   # Run ESLint

# Format code
npm run format                # Format with Prettier
```

## Resources Quick Links

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)
- [TypeScript](https://www.typescriptlang.org/docs)

---

**Version**: 1.0 | **Last Updated**: 2024
