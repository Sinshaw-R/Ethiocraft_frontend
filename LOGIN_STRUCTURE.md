# Login Structure - Separate Portals

## Overview

The authentication system has been redesigned with **separate login portals** for different user types, providing better security, UX, and role management.

---

## Authentication Flow

```
/auth
  ├── /auth/login           → Customer & Artisan Login
  ├── /auth/admin           → Staff & Admin Login  
  ├── /auth/register        → Registration (Customers & Artisans)
  └── /auth (choice page)   → Login Portal Selection
```

---

## 1. Login Choice Page (`/auth`)

**Purpose**: Main entry point for all authentication

**Features**:
- Two distinct login options with clear icons
- Customer & Artisan card (Users icon)
- Staff & Admin card (Lock icon)
- Registration link
- Clean, professional design

**User Journey**:
- User lands on `/auth`
- Chooses between Customer/Artisan or Staff/Admin
- Redirected to appropriate login page

---

## 2. Customer & Artisan Login (`/auth/login`)

**Purpose**: Login for marketplace users (buyers and sellers)

**Supported Roles**:
- `customer` - Shoppers browsing and buying products
- `artisan` - Sellers creating and managing shop

**Features**:
- Role selector (Customer/Artisan toggle)
- Email login
- Password field with forgot password link
- Social login (Google, GitHub)
- Link to registration
- Responsive design

**Redirect Logic**:
```
customer → /customer/dashboard
artisan  → /artisan/dashboard
```

**File**: `/vercel/share/v0-project/app/auth/login/page.tsx`

---

## 3. Staff & Admin Login (`/auth/admin`)

**Purpose**: Secure login for internal staff and administrators

**Supported Roles**:
- `agent` - Customer support and order verification
- `admin` - Platform administrators and moderators

**Features**:
- Role selector (Agent/Admin toggle)
- Email field
- **Employee ID field** (additional security)
- Password field with forgot password link
- Security notice alert
- SSO options (Microsoft, Google)
- Contact IT Support link
- Enhanced security styling (darker border, shield icon)

**Security Enhancements**:
- Employee ID requirement
- Security notice displayed
- SSO/Microsoft integration ready
- Special visual styling to differentiate from public login

**Redirect Logic**:
```
agent → /agent/dashboard
admin → /admin/dashboard
```

**File**: `/vercel/share/v0-project/app/auth/admin/page.tsx`

---

## 4. Registration (`/auth/register`)

**Purpose**: New user account creation (Customers & Artisans only)

**Supported Roles**:
- `customer` - New marketplace shopper
- `artisan` - New marketplace seller

**Features**:
- Role selector
- Name fields (first, last)
- Email validation
- Password requirements
- Password confirmation
- Terms acceptance checkbox
- Success screen with redirect

**Redirect Logic**:
- Registration success → `/auth` (choice page)
- Then user proceeds with appropriate login

**File**: `/vercel/share/v0-project/app/auth/register/page.tsx`

---

## File Structure

```
app/auth/
├── page.tsx              # Choice/entry page
├── login/
│   └── page.tsx          # Customer & Artisan login
├── admin/
│   └── page.tsx          # Staff & Admin login
└── register/
    └── page.tsx          # Registration portal
```

---

## Navigation Map

### Public Users
```
Home → /auth (choice) → /auth/login → /customer/dashboard
                    → /artisan/dashboard
```

### New Users
```
Home → /auth/register → /auth (choice) → /auth/login → Dashboard
```

### Staff/Admin
```
Home → /auth (choice) → /auth/admin → /agent/dashboard
                    → /admin/dashboard
```

---

## Design & Styling

### Color Scheme (Golden, White & Black)
- **Login Choice**: Golden accents for both options
- **Customer/Artisan Login**: Golden header and buttons (secondary)
- **Admin/Staff Login**: Black header and buttons (primary)
- **Registration**: Golden secondary theme

### Typography
- Headings: Bold, clear messaging
- Subtext: Muted colors for context
- Labels: Semibold for clarity

### Components Used
- `Header` & `Footer` - Navigation and branding
- `Card` - Main form container
- `Input` - Email, password, employee ID
- `Button` - Submit and navigation
- `Label` - Form labels
- `Alert` - Error messages and security notices
- Icons: `Shield`, `Lock`, `Users`, `AlertCircle`

---

## Security Considerations

### Customer/Artisan Portal
- Standard email/password authentication
- Social login integration
- No sensitive company data access

### Admin/Staff Portal
- Employee ID requirement (additional factor)
- Security notice alert
- SSO integration ready
- Enhanced styling to prevent confusion
- Separate URL (`/auth/admin`)

### Best Practices Implemented
- Password reset links
- No storing passwords in logs
- Separate portals prevent role confusion
- Clear security messaging for admin portal

---

## Future Enhancements

1. **Two-Factor Authentication (2FA)**
   - SMS/Email OTP for admin portal
   - TOTP apps support

2. **Single Sign-On (SSO)**
   - Microsoft Azure AD integration
   - Google Workspace integration

3. **Password Policy**
   - Complexity requirements
   - Expiration policies
   - History checking

4. **Audit Logging**
   - Track all login attempts
   - Session management
   - IP whitelisting for admin

5. **Biometric Auth**
   - Fingerprint for mobile
   - Face recognition

---

## Testing URLs

| Page | URL | Purpose |
|------|-----|---------|
| Choice | `/auth` | Select login type |
| Customer/Artisan | `/auth/login` | Marketplace users |
| Admin/Staff | `/auth/admin` | Internal staff |
| Register | `/auth/register` | New accounts |

---

## Component Customization

### Adding Another Admin Role
If you need to add more admin roles (e.g., `moderator`):

1. Update `AdminRole` type in `/app/auth/admin/page.tsx`
2. Add role to role selection buttons
3. Update dashboard map
4. Create corresponding dashboard page

Example:
```tsx
type AdminRole = 'agent' | 'admin' | 'moderator'

// Add to buttons
{(['agent', 'admin', 'moderator'] as const).map((r) => (...))}

// Add to redirect
const dashboardMap: Record<AdminRole, string> = {
  agent: '/agent/dashboard',
  admin: '/admin/dashboard',
  moderator: '/moderator/dashboard',
}
```

---

## Related Files

- `/app/layout.tsx` - Root layout
- `/components/shared/header.tsx` - Navigation header
- `/components/shared/footer.tsx` - Footer
- `/lib/utils.ts` - Utility functions
- `/app/globals.css` - Global theme (Golden, White, Black)

---

## Troubleshooting

### User redirected to wrong dashboard
- Check `dashboardMap` in appropriate login page
- Verify role is set correctly in state
- Ensure dashboard page exists at redirect URL

### Login button disabled
- Check all required fields are filled
- For admin portal, ensure Employee ID is entered
- Verify email format is valid

### Styling issues
- Ensure `globals.css` is loaded
- Check design tokens for primary/secondary colors
- Verify Tailwind CSS is configured correctly

---

**Last Updated**: 2026-03-07
**Version**: 1.0
**Maintainer**: Development Team
