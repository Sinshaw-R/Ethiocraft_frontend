# Authentication Flow Diagrams

## Complete Authentication System

```
┌─────────────────────────────────────────────────────────────────┐
│                    ETHIOPIAN HANDCRAFT MARKETPLACE               │
│                      AUTHENTICATION SYSTEM                       │
└─────────────────────────────────────────────────────────────────┘

                              ┌──────┐
                              │ Home │
                              └──┬───┘
                                 │
                        ┌────────▼────────┐
                        │   /auth (Choice)│
                        │ Login Portal    │
                        └────┬────────┬───┘
                             │        │
                ┌────────────┘        └────────────┐
                │                                   │
        ┌───────▼──────────┐            ┌──────────▼──────┐
        │  /auth/login     │            │  /auth/admin    │
        │ Customer/Artisan │            │  Staff & Admin  │
        │    Portal        │            │     Portal      │
        └───┬──┬───────────┘            └──┬──┬───────────┘
            │  │                           │  │
     ┌──────┘  └─────┐            ┌────────┘  └──────┐
     │               │            │                  │
  ┌──▼────┐      ┌──▼────┐    ┌──▼────┐       ┌─────▼──┐
  │Customer│     │Artisan │    │ Agent │       │ Admin  │
  │ Role  │     │ Role   │    │ Role  │       │ Role   │
  └──┬────┘     └──┬────┘     └──┬────┘       └────┬───┘
     │             │             │                │
  ┌──▼─────────────▼──┐    ┌─────▼────────────────▼────┐
  │ /customer/       │    │ /agent/dashboard or        │
  │ /artisan/        │    │ /admin/dashboard           │
  │ dashboard        │    │                            │
  └──────────────────┘    └────────────────────────────┘
```

---

## Customer & Artisan Login Flow

```
                        ┌──────────────────┐
                        │  /auth/login     │
                        │ (PUBLIC LOGIN)   │
                        └────────┬─────────┘
                                 │
                    ┌────────────┼────────────┐
                    │                         │
              ┌─────▼────┐           ┌────────▼────┐
              │ Customer │           │  Artisan    │
              │ Selected │           │  Selected   │
              └─────┬────┘           └────────┬────┘
                    │                        │
         ┌──────────▼────────┐   ┌───────────▼─────────┐
         │ Enter Credentials │   │ Enter Credentials   │
         ├────────┬──────────┤   ├──────────┬──────────┤
         │ • Email│          │   │ • Email  │          │
         │ • Pass │          │   │ • Pass   │          │
         └────────┼──────────┘   └──────────┼──────────┘
                  │                        │
         ┌────────▼──────────┐   ┌─────────▼────────┐
         │ Validate Cred    │   │ Validate Cred    │
         └────────┬──────────┘   └─────────┬────────┘
                  │                        │
         ┌────────▼──────────┐   ┌─────────▼────────┐
         │ Create Session   │   │ Create Session   │
         └────────┬──────────┘   └─────────┬────────┘
                  │                        │
         ┌────────▼──────────┐   ┌─────────▼────────┐
         │ REDIRECT TO:      │   │ REDIRECT TO:     │
         │ /customer/        │   │ /artisan/        │
         │ dashboard         │   │ dashboard        │
         └───────────────────┘   └──────────────────┘
```

---

## Admin & Staff Login Flow

```
                        ┌──────────────────┐
                        │  /auth/admin     │
                        │ (SECURE LOGIN)   │
                        └────────┬─────────┘
                                 │
                    ┌────────────┼────────────┐
                    │                         │
              ┌─────▼────┐           ┌────────▼────┐
              │ Agent     │           │ Admin       │
              │ Selected  │           │ Selected    │
              └─────┬────┘           └────────┬────┘
                    │                        │
         ┌──────────▼──────────┐   ┌─────────▼─────────┐
         │ Enter Credentials   │   │ Enter Credentials │
         ├────────┬────────────┤   ├──────────┬────────┤
         │ • Email│            │   │ • Email  │        │
         │ • Emp# │ (REQUIRED) │   │ • Emp#   │(REQ)  │
         │ • Pass │            │   │ • Pass   │        │
         └────────┼────────────┘   └──────────┼────────┘
                  │                           │
    ┌─────────────▼────────────┐  ┌──────────▼──────────┐
    │ Security Checks:         │  │ Security Checks:    │
    │ ✓ Email valid            │  │ ✓ Email valid       │
    │ ✓ Employee ID exists     │  │ ✓ Employee ID exist │
    │ ✓ Password correct       │  │ ✓ Password correct  │
    │ ✓ Agent permissions      │  │ ✓ Admin perms       │
    └─────────────┬────────────┘  └──────────┬──────────┘
                  │                          │
    ┌─────────────▼────────────┐  ┌──────────▼──────────┐
    │ Create Secure Session    │  │ Create Secure Sess. │
    │ • IP logging             │  │ • IP logging        │
    │ • Activity tracking      │  │ • Activity tracking │
    └─────────────┬────────────┘  └──────────┬──────────┘
                  │                          │
    ┌─────────────▼────────────┐  ┌──────────▼──────────┐
    │ REDIRECT TO:             │  │ REDIRECT TO:        │
    │ /agent/dashboard         │  │ /admin/dashboard    │
    └──────────────────────────┘  └─────────────────────┘
```

---

## Registration to Login Flow

```
                        ┌───────────┐
                        │   Home    │
                        └─────┬─────┘
                              │
                        ┌─────▼──────────┐
                        │ /auth/register │
                        │ (NEW USERS)    │
                        └─────┬──────────┘
                              │
                    ┌─────────┼────────────┐
                    │                      │
              ┌─────▼────┐        ┌────────▼────┐
              │ Customer │        │ Artisan     │
              │          │        │             │
              └─────┬────┘        └────────┬────┘
                    │                     │
         ┌──────────▼─────────┐  ┌────────▼──────────┐
         │ Enter Details:     │  │ Enter Details:    │
         ├────────┬──────────┤  ├──────────┬────────┤
         │ • Name │           │  │ • Name   │        │
         │ • Email│           │  │ • Email  │        │
         │ • Pass │           │  │ • Pass   │        │
         │ • Agree│ Terms     │  │ • Agree  │ Terms  │
         └────────┼──────────┘  └──────────┼────────┘
                  │                       │
         ┌────────▼──────────┐ ┌──────────▼────────┐
         │ Validate Input   │ │ Validate Input   │
         └────────┬──────────┘ └──────────┬───────┘
                  │                      │
         ┌────────▼──────────┐ ┌──────────▼───────┐
         │ Create Account   │ │ Create Account   │
         └────────┬──────────┘ └──────────┬───────┘
                  │                      │
         ┌────────▼──────────────────────▼────────┐
         │  ✓ Account Created!                    │
         │  Redirecting to /auth (choice page)   │
         │  in 2 seconds...                       │
         └────────┬─────────────────────────────┘
                  │
         ┌────────▼──────────────────────────────┐
         │  /auth (Choice Page)                  │
         │  Choose: Customer/Artisan or          │
         │          Staff/Admin Login            │
         └────────┬───────────────┬──────────────┘
                  │               │
           ┌──────▼────┐   ┌──────▼────┐
           │/auth/login│   │/auth/admin│
           └────────────┘   └───────────┘
```

---

## State Management in Login Pages

### /auth/login (Customer/Artisan)
```
State Variables:
├── role: 'customer' | 'artisan'
├── email: string
├── password: string
├── isLoading: boolean
└── error: string

Actions:
├── setRole(newRole)
├── setEmail(value)
├── setPassword(value)
├── handleLogin(event)
└── setError(message)
```

### /auth/admin (Staff/Admin)
```
State Variables:
├── role: 'agent' | 'admin'
├── email: string
├── employeeId: string        ← ADDITIONAL FIELD
├── password: string
├── isLoading: boolean
└── error: string

Actions:
├── setRole(newRole)
├── setEmail(value)
├── setEmployeeId(value)      ← ADDITIONAL VALIDATION
├── setPassword(value)
├── handleLogin(event)
└── setError(message)
```

---

## Redirect Logic

### Customer/Artisan Login
```
email + password + role → validate → 
  if role === 'customer':
    redirect('/customer/dashboard')
  else if role === 'artisan':
    redirect('/artisan/dashboard')
```

### Admin/Staff Login
```
email + employeeId + password + role → validate →
  if role === 'agent':
    redirect('/agent/dashboard')
  else if role === 'admin':
    redirect('/admin/dashboard')
```

---

## Security Comparison

| Feature | Public Portal | Admin Portal |
|---------|---------------|--------------|
| URL Path | `/auth/login` | `/auth/admin` |
| Email | ✓ Required | ✓ Required |
| Password | ✓ Required | ✓ Required |
| Employee ID | ✗ Not needed | ✓ Required |
| Roles | Customer, Artisan | Agent, Admin |
| SSO Options | Google, GitHub | Microsoft, Google |
| Security Alert | ✗ No | ✓ Yes |
| Styling | Golden accents | Black primary |
| Redirect | User dashboards | Staff dashboards |

---

## Error Handling

### Common Errors

#### Public Login
- Empty email field
- Invalid email format
- Empty password
- Incorrect credentials

#### Admin Login
- Empty email field
- Invalid email format
- Empty Employee ID
- Empty password
- Employee ID not found in system
- Incorrect credentials
- Permissions mismatch

---

**Last Updated**: 2026-03-07
**Version**: 1.0
