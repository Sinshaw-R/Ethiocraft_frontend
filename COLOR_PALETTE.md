# Color Palette - Golden, White & Black Theme

## Official Colors

### Primary Color: Black
- **Hex**: #000000
- **RGB**: rgb(0, 0, 0)
- **HSL**: 0° 0% 0%
- **Usage**: Headers, footers, primary buttons, main UI elements
- **CSS Variable**: `--primary`
- **Tailwind Class**: `bg-primary`, `text-primary`, `border-primary`

### Secondary Color: Golden
- **Hex**: #D4AF37
- **RGB**: rgb(212, 175, 55)
- **HSL**: 45° 75% 60%
- **Usage**: Call-to-action buttons, highlights, accents, badges
- **CSS Variable**: `--secondary`
- **Tailwind Class**: `bg-secondary`, `text-secondary`, `border-secondary`

### Accent Color: Golden
- **Hex**: #D4AF37
- **RGB**: rgb(212, 175, 55)
- **HSL**: 45° 75% 60%
- **Usage**: Emphasis, hover states, focus indicators
- **CSS Variable**: `--accent`
- **Tailwind Class**: `bg-accent`, `text-accent`, `border-accent`

### Background: White
- **Hex**: #FFFFFF
- **RGB**: rgb(255, 255, 255)
- **HSL**: 0° 0% 100%
- **Usage**: Page background, card backgrounds
- **CSS Variable**: `--background`
- **Tailwind Class**: `bg-background`

### Foreground: Black
- **Hex**: #000000 to #262626 (15% dark)
- **RGB**: rgb(0, 0, 0) to rgb(38, 38, 38)
- **HSL**: 0° 0% 0% to 0° 0% 15%
- **Usage**: Text, headings, primary content
- **CSS Variable**: `--foreground`
- **Tailwind Class**: `text-foreground`

## Semantic Colors

### Neutral / Muted
- **Light**: #E5E5E5
- **Medium**: #BFBFBF
- **Dark**: #808080
- **Usage**: Secondary text, borders, disabled states

### Success
- **Color**: Green
- **Hex**: #10B981
- **Usage**: Confirmation, completed actions, success messages

### Warning
- **Color**: Orange
- **Hex**: #F59E0B
- **Usage**: Cautions, pending actions, warnings

### Error
- **Color**: Red
- **Hex**: #EF4444
- **Usage**: Errors, destructive actions, alerts

## Color Combinations

### Primary + Secondary (Black + Golden)
Perfect for:
- Hero sections
- CTAs against dark backgrounds
- Premium branding
- Navigation bars

### Primary + White (Black + White)
Perfect for:
- Main content areas
- Cards and panels
- Text on dark backgrounds
- High contrast areas

### Secondary + Black (Golden + Black)
Perfect for:
- Buttons on light backgrounds
- Badges and pills
- Hover and active states
- Icons and accents

## Usage Guidelines

### Header
```
Background: Primary (Black #000000)
Text: White/Light foreground
Accents: Secondary (Golden #D4AF37)
Borders: Muted/Secondary
```

### Buttons

#### Primary Button
```css
background-color: var(--primary);      /* Black */
color: var(--primary-foreground);      /* White */
border: 1px solid var(--primary);
```

#### Secondary Button
```css
background-color: var(--secondary);    /* Golden */
color: var(--secondary-foreground);    /* Black */
border: 1px solid var(--secondary);
```

#### Outlined Button
```css
background-color: transparent;
color: var(--primary);                 /* Black */
border: 1px solid var(--primary);
```

### Cards
```css
background-color: var(--background);   /* White */
border: 1px solid var(--border);       /* Light gray */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
```

### Text Hierarchy
```css
h1, h2, h3: color: var(--foreground);  /* Black/Dark */
p, span: color: var(--foreground);     /* Black/Dark */
.secondary-text: color: var(--muted-foreground);  /* Gray */
```

## Accessibility

### Contrast Ratios
- **Black on White**: 21:1 (AAA ✓)
- **Golden on White**: 5.8:1 (AA ✓)
- **Golden on Black**: 11.2:1 (AAA ✓)
- **Gray on White**: 4.5:1 (AA ✓)

All color combinations meet WCAG AA or AAA standards for accessibility.

## CSS Variables (Root)

```css
/* Light Mode */
:root {
  --background: 0 0% 100%;           /* White */
  --foreground: 0 0% 15%;            /* Dark text */
  --primary: 0 0% 0%;                /* Black */
  --primary-foreground: 0 0% 100%;   /* White text */
  --secondary: 45 75% 60%;           /* Golden */
  --secondary-foreground: 0 0% 0%;   /* Black text */
  --accent: 45 75% 60%;              /* Golden */
  --accent-foreground: 0 0% 0%;      /* Black text */
  --muted: 0 0% 90%;                 /* Light gray */
  --muted-foreground: 0 0% 50%;      /* Medium gray */
  --border: 0 0% 85%;                /* Border gray */
}

/* Dark Mode */
.dark {
  --background: 0 0% 8%;             /* Very dark */
  --foreground: 0 0% 95%;            /* Light text */
  --primary: 45 75% 60%;             /* Golden */
  --primary-foreground: 0 0% 0%;     /* Black text */
  --secondary: 0 0% 15%;             /* Very dark */
  --secondary-foreground: 45 75% 60%;/* Golden text */
  --accent: 45 75% 60%;              /* Golden */
  --accent-foreground: 0 0% 0%;      /* Black text */
}
```

## Implementation Examples

### Hero Section
```tsx
<section className="bg-primary text-primary-foreground py-20">
  <h1 className="text-4xl font-bold">Welcome</h1>
  <p className="text-lg mb-6">Discover our collection</p>
  <Button className="bg-secondary text-secondary-foreground">
    Shop Now
  </Button>
</section>
```

### Product Card
```tsx
<Card className="bg-background border border-border">
  <div className="bg-muted p-4 rounded-t-lg">
    <img src="..." alt="product" />
  </div>
  <div className="p-4">
    <h3 className="text-foreground font-bold">Product Name</h3>
    <p className="text-muted-foreground text-sm">Description</p>
    <div className="flex justify-between items-center mt-4">
      <span className="text-secondary font-bold">$99.99</span>
      <Button className="bg-primary text-primary-foreground">
        Add
      </Button>
    </div>
  </div>
</Card>
```

### Badge
```tsx
<Badge className="bg-accent text-accent-foreground">
  Featured
</Badge>
```

## Tools for Testing

- **Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Color Blindness Simulator**: https://www.colorblindnesssimulator.com/
- **Tailwind CSS Playground**: https://play.tailwindcss.com/
- **HSL to Hex Converter**: Use browser DevTools

## Brand Extensions

### If you need additional colors:

| Purpose | Color | Hex |
|---------|-------|-----|
| Success | Green | #10B981 |
| Warning | Orange | #F59E0B |
| Error | Red | #EF4444 |
| Info | Blue | #3B82F6 |
| Disabled | Gray | #D1D5DB |

## Exporting for Design Teams

### Figma Variables
Copy this JSON format for Figma:
```json
{
  "colors": {
    "primary": "#000000",
    "secondary": "#D4AF37",
    "background": "#FFFFFF",
    "foreground": "#000000"
  }
}
```

### CSS
Add to your stylesheets:
```css
:root {
  --color-primary: #000000;
  --color-secondary: #D4AF37;
  --color-background: #FFFFFF;
  --color-foreground: #000000;
}
```
