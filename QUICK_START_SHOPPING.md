# Quick Start - Shopping Features

## Get Started in 30 Seconds

### 1. Start the Dev Server
```bash
npm run dev
```

### 2. Visit Pages

**Product Listing:**
```
http://localhost:3000/products
```

**Individual Product:**
```
http://localhost:3000/products/1
http://localhost:3000/products/2
http://localhost:3000/products/3
```

**Shopping Cart:**
```
http://localhost:3000/cart
```

## What to Try

### On Product List Page
- [ ] Sort by "Highest Rated"
- [ ] Filter by "Jewelry" category
- [ ] Adjust price slider to see fewer products
- [ ] Click a product card to go to detail page

### On Product Detail Page
- [ ] Change quantity using +/- buttons
- [ ] Click "Add to Cart" button
- [ ] Click heart icon to add to favorites
- [ ] Switch between Details, Artisan, Reviews tabs
- [ ] Scroll down to see related products

### On Cart Page
- [ ] Change product quantities
- [ ] Remove a product
- [ ] Enter promo code: **WELCOME10** (10% off)
- [ ] Watch totals update automatically
- [ ] Refresh browser to see cart persists

## File Locations

| Feature | File | URL |
|---------|------|-----|
| Product List | `app/products/page.tsx` | `/products` |
| Product Detail | `app/products/[id]/page.tsx` | `/products/1` |
| Shopping Cart | `app/cart/page.tsx` | `/cart` |
| Cart Logic | `lib/cart-context.tsx` | - |

## Data Structure

All products have these properties:
```typescript
{
  id: number
  name: string
  price: number
  image: string
  category: string
  rating: number
  reviews: number
  inStock: boolean
  isNew?: boolean
  description: string
  artisan: string
}
```

## Using the Cart Hook

In any component:
```typescript
import { useCart } from '@/lib/cart-context'

export function MyComponent() {
  const { items, addItem, removeItem, cartCount, cartTotal } = useCart()
  
  // Use these:
  // items - array of cart items
  // cartCount - total items (sum of quantities)
  // cartTotal - total price
  // addItem(item) - add item to cart
  // removeItem(id) - remove by ID
}
```

## Sample Products

| # | Name | Price | Category | Stock |
|---|------|-------|----------|-------|
| 1 | Traditional Habesha Dress | $149.99 | Textiles | ✓ |
| 2 | Hand-Woven Basket | $89.99 | Crafts | ✓ New |
| 3 | Gold Filigree Jewelry | $199.99 | Jewelry | ✓ |
| 4 | Leather Shoulder Bag | $129.99 | Accessories | ✓ |
| 5 | Handmade Ethiopian Shawl | $79.99 | Textiles | ✓ |
| 6 | Coffee Ceremony Set | $159.99 | Crafts | ✓ |
| 7 | Silver Amharic Pendant | $89.99 | Jewelry | ✓ New |
| 8 | Woven Market Tote | $109.99 | Accessories | ✗ |

## Theme Colors

**Golden, White & Black Theme**
- **Black:** Headers, primary backgrounds
- **Golden:** Buttons, accents, highlights
- **White:** Page backgrounds, cards
- **Grays:** Text, borders, muted elements

## Responsive Design

### Mobile (< 768px)
- Single column product grid
- Collapsible filter sidebar
- Full-width buttons

### Tablet (768px - 1024px)
- 2-column product grid
- Visible filter sidebar
- Optimized spacing

### Desktop (> 1024px)
- 3-column product grid
- Permanent filter sidebar
- Sticky cart summary

## Code Examples

### Add Item to Cart
```typescript
const { addItem } = useCart()

const handleAddToCart = (product) => {
  addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    quantity: 1,
    category: product.category
  })
}
```

### Display Cart Count
```typescript
const { cartCount } = useCart()

<Button>
  Cart ({cartCount})
</Button>
```

### Get Cart Total
```typescript
const { cartTotal } = useCart()

<span>${cartTotal.toFixed(2)}</span>
```

## Key Features

### Product List Features
✓ Filter by category  
✓ Filter by price range  
✓ Sort by popularity/price/rating  
✓ New product badges  
✓ Out of stock indicators  
✓ Star ratings with review count  
✓ Responsive grid layout  

### Product Detail Features
✓ Image gallery with thumbnails  
✓ Artisan information  
✓ Customer reviews  
✓ Product specifications  
✓ Care instructions  
✓ Related products  
✓ Trust badges  

### Cart Features
✓ Quantity management  
✓ Item removal  
✓ Promo codes  
✓ Real-time calculations  
✓ Shipping logic  
✓ Tax calculation  
✓ localStorage persistence  
✓ Empty state handling  

## Common Tasks

### Display Cart Count in Header
```typescript
// In header component
const { cartCount } = useCart()
return <Badge>{cartCount}</Badge>
```

### Conditionally Show Add to Cart
```typescript
const handleAddClick = () => {
  if (product.inStock) {
    addItem({ ...product, quantity: 1 })
  }
}
```

### Clear Cart
```typescript
const { clearCart } = useCart()
<Button onClick={clearCart}>Clear Cart</Button>
```

## Folder Navigation

```
app/
├── page.tsx                   # Home
├── products/
│   ├── page.tsx              # Product list
│   └── [id]/
│       └── page.tsx          # Product detail
├── cart/
│   └── page.tsx              # Shopping cart
├── auth/
│   ├── login/page.tsx
│   └── register/page.tsx
├── customer/dashboard/page.tsx
├── artisan/dashboard/page.tsx
├── admin/dashboard/page.tsx
├── agent/dashboard/page.tsx
└── layout.tsx

lib/
├── cart-context.tsx           # Cart state
└── utils.ts

components/
├── shared/
│   ├── header.tsx
│   └── footer.tsx
└── ui/
    └── [50+ shadcn components]
```

## Next Steps

1. **Test all features** - Browse products, add to cart, view details
2. **Customize products** - Edit sample data in page components
3. **Add database** - Replace sample data with real products
4. **Implement checkout** - Add payment processing
5. **User accounts** - Save cart per user
6. **Inventory tracking** - Real-time stock updates

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Cart empties on refresh | localStorage not working - check browser settings |
| Images not loading | Check image paths in data |
| Layout looks off | Clear browser cache and refresh |
| Filters not working | Check category names match product data |

## Performance Tips

- Use Next.js Image component for production
- Implement pagination for large product lists
- Cache product data with SWR or React Query
- Lazy load product images
- Code split dashboard routes

---

**You're all set! Start exploring your marketplace at `/products`** 🛍️
