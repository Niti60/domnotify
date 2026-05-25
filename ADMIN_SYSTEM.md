# DomNotify Admin System - Complete Documentation

## Overview

The DomNotify Admin System is a privileged operational layer for platform administrators. It provides global platform visibility and management capabilities without workspace/tenant restrictions.

**Key Principle:** Admins are global platform operators with access to ALL system features and data.

---

## Architecture

### Admin User Model Updates

**New Fields Added to User:**
```javascript
isAdmin: { type: Boolean, default: false, required: true }
lastLogin: { type: Date, default: null }
```

### Middleware System

#### 1. Admin Guard Middleware (`/src/middlewares/admin.middleware.js`)

Reusable authentication guard for admin routes and APIs:

```javascript
import { adminGuard, adminUnauthorized } from '@/middlewares/admin.middleware';

// In API routes
export async function GET(req) {
  const auth = await adminGuard(req);
  if (!auth.isAuthorized) {
    return adminUnauthorized();
  }
  // Admin logic here
}
```

**Returns:**
- `isAuthorized` (boolean) - Whether user is admin
- `user` (User object) - Admin user data
- `message` (string) - Status message

#### 2. Route Protection

**Updated main middleware configuration** in `middleware.js`:

```javascript
export const config = {
  matcher: [
    // Existing protected routes
    '/dashboard/:path*',
    '/monitoring/:path*',
    '/watchlist/:path*',
    // ... other routes
    
    // Admin routes - protected
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
```

---

## Admin APIs

All admin APIs require `isAdmin === true` and return `403 Forbidden` otherwise.

### Users Management

#### `GET /api/admin/users`

List all users with pagination and filtering.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20, max: 100) - Results per page
- `search` (string) - Search by name or email
- `filterPremium` (string) - Filter: "true", "false", or empty
- `filterRole` (string) - Filter by user role

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "userId",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "developer",
      "isPremiumUser": true,
      "premiumPlanType": "pro",
      "createdAt": "2024-01-01T00:00:00Z",
      "lastLogin": "2024-01-15T10:30:00Z",
      "watchlistCount": 5,
      "totalDomains": 12
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

#### `POST /api/admin/users`

Create a new user.

**Request Body:**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "SecurePassword123",
  "role": "developer",
  "companyName": "Optional"
}
```

#### `GET /api/admin/users/[id]`

Get detailed information about a specific user.

#### `PATCH /api/admin/users/[id]`

Update user information.

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "password": "NewPassword123",
  "role": "entrepreneur",
  "companyName": "New Company",
  "isPremiumUser": true,
  "premiumPlanType": "pro",
  "isAdmin": false
}
```

#### `DELETE /api/admin/users/[id]`

Delete a user and all associated data.

**Note:** Cannot delete your own account.

### Watchlists

#### `GET /api/admin/watchlists`

View all watchlists across all users.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "user": {
        "_id": "userId",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "developer",
        "isPremiumUser": true
      },
      "domainCount": 5,
      "domains": [
        {
          "_id": "domainId",
          "domainName": "example.com",
          "status": "Available",
          "expiryDate": "2025-06-01",
          "sslStatus": "Valid",
          "sslValidTo": "2025-12-31"
        }
      ]
    }
  ],
  "pagination": { ... }
}
```

### Activity Logs

#### `GET /api/admin/activity`

View activity logs (logins and searches).

**Query Parameters:**
- `type` (string) - "login" or "search"
- `page` (number, default: 1)
- `limit` (number, default: 50, max: 100)

**Response:**
```json
{
  "success": true,
  "activityType": "login",
  "data": [
    {
      "_id": "userId",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "developer",
      "isPremiumUser": true,
      "lastLogin": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### Premium Management

#### `GET /api/admin/premium`

View premium users and statistics.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)
- `plan` (string) - Filter by plan type

**Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "stats": {
    "totalPremiumUsers": 45,
    "planBreakdown": [
      { "_id": "pro", "count": 30 },
      { "_id": "ultra", "count": 15 }
    ]
  },
  "pagination": { ... }
}
```

#### `PATCH /api/admin/premium`

Update user premium status.

**Request Body:**
```json
{
  "userId": "userId",
  "isPremiumUser": true,
  "premiumPlanType": "pro"
}
```

### Dashboard Statistics

#### `GET /api/admin/dashboard`

Get platform statistics for admin dashboard.

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 250,
    "premiumUsers": 45,
    "activeUsers": 120,
    "newUsersThisMonth": 15,
    "totalDomains": 1250,
    "watchlistDomains": 400,
    "expiringDomains": 18,
    "expiringSsl": 5,
    "premiumBreakdown": [
      { "_id": "pro", "count": 30 },
      { "_id": "ultra", "count": 15 }
    ]
  }
}
```

---

## Admin UI

### Pages

#### `/admin` - Admin Dashboard
Main admin overview with platform statistics and quick links.

**Features:**
- Total users, premium users, active users
- Domain statistics
- Expiring domains/SSL alerts
- Premium plan breakdown
- Quick action buttons

#### `/admin/users` - User Management
Manage all platform users with search and filtering.

**Features:**
- List all users with pagination
- Search by name/email
- Filter by premium status
- Delete users
- View user details

#### `/admin/watchlists` - Watchlist Inspection
View all watchlists across the platform.

**Features:**
- Browse all watchlists grouped by user
- View domains in each watchlist
- Domain status and SSL info
- Pagination

#### `/admin/premium` - Premium Management
Manage premium subscriptions.

**Features:**
- View all premium users
- Premium statistics and breakdown
- Toggle premium status
- Change plan type
- Plan distribution charts

#### `/admin/activity` - Activity Logs
Monitor user activity.

**Features:**
- Login history with timestamps
- Search history with frequencies
- Toggle between login/search views
- Pagination

### Components

#### `AdminLayout` (`/src/components/admin/AdminLayout.jsx`)

Page wrapper that ensures admin-only access.

```jsx
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function AdminPage() {
  return (
    <AdminLayout>
      {/* Page content */}
    </AdminLayout>
  );
}
```

**Features:**
- Admin authentication check
- Sidebar navigation
- Redirect non-admins to dashboard
- Mobile responsive

#### `AdminSidebar` (`/src/components/admin/AdminSidebar.jsx`)

Navigation sidebar for admin pages.

- Links to all admin sections
- Mobile toggle
- Back to app link

#### `StatCard` (`/src/components/admin/StatCard.jsx`)

Statistics display card component.

```jsx
<StatCard
  icon={Users}
  label="Total Users"
  value={250}
  subtext="15 new this month"
/>
```

---

## Authentication & Authorization

### Admin Access Requirements

1. **JWT Token** - Valid authentication token in cookies
2. **Admin Flag** - `user.isAdmin === true`
3. **Database Check** - User must exist in database with admin flag

### Non-Admin Behavior

- Accessing `/admin` → Redirected to `/dashboard`
- Accessing `/api/admin/*` → Returns `403 Forbidden`

### Admin Bypass

Admins bypass all workspace/tenant restrictions:
- CANNOT access routes that don't exist
- CAN access all operational routes without workspace checks
- CAN manage any user's data
- CAN view all watchlists/domains

---

## Admin Operations

### Creating Admin Users

#### Method 1: Seed Script

Create the first admin user:

```bash
node scripts/create-admin.js
```

**Default Credentials:**
- Email: `admin@domnotify.com`
- Password: `ChangeMe123!`

**Important:** Change credentials immediately after loginning.

#### Method 2: Database Direct

Find an existing user and set `isAdmin: true`:

```javascript
await User.updateOne(
  { email: 'user@example.com' },
  { isAdmin: true, isPremiumUser: true, premiumPlanType: 'enterprise' }
);
```

#### Method 3: Via Admin API

Once you have one admin, create more via:

```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Cookie: token=<admin-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Admin",
    "email": "newadmin@example.com",
    "password": "SecurePass123",
    "role": "company"
  }'
```

Then upgrade via database or API.

### Common Admin Tasks

#### Upgrade User to Premium

```javascript
await apiFetch('/api/admin/premium', {
  method: 'PATCH',
  body: JSON.stringify({
    userId: 'userId',
    isPremiumUser: true,
    premiumPlanType: 'pro'
  }),
});
```

#### Delete Problematic User

```javascript
await apiFetch(`/api/admin/users/userId`, {
  method: 'DELETE'
});
```

#### View User's Watchlist

Navigate to `/admin/watchlists` and find user by name to see all their domains.

---

## Database Fields

### User Model Updates

```javascript
{
  // Existing fields...
  name: String,
  email: String,
  role: String,
  isPremiumUser: Boolean,
  premiumPlanType: String,
  
  // New fields
  isAdmin: { type: Boolean, default: false, required: true },
  lastLogin: { type: Date, default: null }
}
```

---

## Security Considerations

### ✅ What's Protected

- All `/admin` routes require authentication + admin flag
- All `/api/admin/*` endpoints require authentication + admin flag
- Admin self-deletion is prevented
- Admins can only be created by database/seed script initially

### ⚠️ Important Notes

1. **No tenant restrictions for admins** - Admins can see all data
2. **Admin flag is permanent per session** - Refresh fetches fresh flag from DB
3. **Password changes** - Admins must change their password after initial setup
4. **Activity logging** - Admin actions are tracked via lastLogin tracking
5. **No API keys** - Admins use session JWTs like regular users

### Recommended Security Practices

1. ✅ Create admin user via seed script with strong password
2. ✅ Change default credentials immediately on first login
3. ✅ Use strong passwords (minimum 8 chars with mixed case)
4. ✅ Regularly audit admin activity via activity logs
5. ✅ Limit number of admin accounts
6. ✅ Monitor premium upgrades/downgrades
7. ✅ Review user deletions audit trail

---

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── page.js                    # Admin dashboard
│   │   ├── users/
│   │   │   └── page.js               # Users management
│   │   ├── watchlists/
│   │   │   └── page.js               # Watchlists view
│   │   ├── premium/
│   │   │   └── page.js               # Premium management
│   │   └── activity/
│   │       └── page.js               # Activity logs
│   └── api/
│       └── admin/
│           ├── dashboard/route.js    # Dashboard stats
│           ├── users/
│           │   ├── route.js          # List/create users
│           │   └── [id]/route.js     # Get/update/delete user
│           ├── watchlists/route.js   # View watchlists
│           ├── activity/route.js     # Activity logs
│           └── premium/route.js      # Premium management
├── components/
│   └── admin/
│       ├── AdminLayout.jsx            # Page wrapper
│       ├── AdminSidebar.jsx           # Navigation sidebar
│       └── StatCard.jsx               # Stat card component
├── middlewares/
│   ├── auth.middleware.js             # Auth middleware
│   └── admin.middleware.js            # Admin guard middleware
├── models/
│   └── User.js                        # User model (updated)
└── hooks/
    └── useAuth.js                     # Auth hook (re-export)

scripts/
└── create-admin.js                    # Admin seed script
```

---

## Troubleshooting

### "Admin access required" Error

- Verify JWT token is valid and in cookies
- Check user `isAdmin` field is true in database
- Refresh page to reload user data
- Check browser console for token errors

### Sidebar Not Showing

- Ensure you're logged in as admin user
- Check browser console for errors
- Verify middleware is allowing `/admin*` routes

### API Fails with 403

- Ensure `isAdmin: true` in database
- Check JWT cookie is being sent
- Verify token hasn't expired
- Refresh and retry

### Can't Create First Admin

Use seed script:
```bash
MONGODB_URI=your_uri node scripts/create-admin.js
```

---

## Future Enhancements

- [ ] Two-factor authentication for admins
- [ ] Admin action audit logs (who did what when)
- [ ] Bulk operations (delete/upgrade multiple users)
- [ ] Advanced analytics dashboard
- [ ] Email templates management
- [ ] System configuration panel
- [ ] Backup/restore functionality
- [ ] Rate limit management
- [ ] Promotional codes/coupons
- [ ] Refunds and subscription management

---

## Support

For issues or questions about the admin system:

1. Check Database: Verify user `isAdmin` field
2. Check Middleware: Verify `/admin` is in protected routes
3. Check Console: Browser console for JavaScript errors
4. Check Network: Network tab for API response codes
5. Check Seed Script: Run `node scripts/create-admin.js` for first admin

---

**Version:** 1.0  
**Last Updated:** 2026-01-01  
**Status:** Production Ready
