# Authentication Flow Documentation

## Overview

This document describes the authentication flow for the Love Jar application, covering how users sign up, sign in, and access protected routes.

## Technology Stack

- **Firebase Authentication** - User authentication (email/password)
- **Firebase Firestore** - User profile storage
- **Firebase Admin SDK** - Server-side operations that bypass security rules
- **react-hot-toast** - Toast notifications for user feedback

## Architecture

### Key Principles

1. **Single Source of Truth** - The `useAuth` hook manages all authentication state
2. **Server-Side Operations** - All database queries use Firebase Admin SDK
3. **Protected Routes** - Pages are wrapped with `AuthLayout` to check authentication
4. **No Direct Navigation During Render** - All navigation happens in `useEffect` hooks

### Components

```
app/
├── hooks/
│   └── useAuth.js          # Core authentication hook
├── components/
│   ├── auth/
│   │   ├── index.js        # Barrel export
│   │   ├── AuthForm.jsx    # Reusable form component
│   │   └── AuthLayout.jsx  # Protected route wrapper
│   └── providers/
│       └── ToastProvider.jsx  # Toast notification provider
├── signin/
│   └── page.jsx            # Sign in page
├── signup/
│   └── page.jsx            # Sign up page
└── couple/
    ├── create/
    │   └── page.jsx        # Create couple page
    ├── join/
    │   └── page.jsx        # Join couple page
    └── page.jsx            # Couple management page
```

## Authentication Hook (`useAuth`)

The `useAuth` hook provides authentication state and methods:

```javascript
const { user, loading, error, isAuthenticated, signOut, displayName, email, uid, coupleId } = useAuth();
```

### State Variables

| Variable | Type | Description |
|----------|------|-------------|
| `user` | `Object\|null` | Firebase user object |
| `loading` | `boolean` | Auth state loading flag |
| `error` | `string\|null` | Error message if any |
| `isAuthenticated` | `boolean` | `true` if user exists and loaded |
| `coupleId` | `string\|null` | User's couple ID (from Firestore via Admin SDK) |

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `signOut` | none | `Promise<void>` | Signs out user and clears state |

### Usage Example

```jsx
import { useAuth } from "@/app/hooks/useAuth";

function MyComponent() {
  const { user, loading, coupleId, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

  return (
    <div>
      Welcome, {user.displayName}!
      {coupleId && <p>Part of couple: {coupleId}</p>}
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

## Route Protection Patterns

### For Protected Pages (require login)

Use `AuthLayout` component:

```jsx
import { AuthLayout } from "@/app/components/auth";
import { useAuth } from "@/app/hooks/useAuth";

export default function ProtectedPage() {
  const { user, loading, coupleId } = useAuth();

  return (
    <AuthLayout
      loading={loading}
      user={user}
      coupleId={coupleId}
      loadingText="Loading..."
      redirectTo="/signin"
    >
      <PageContent />
    </AuthLayout>
  );
}
```

### For Auth Pages (redirect if logged in)

Use `AuthPage` component (signin/signup):

```jsx
import { AuthPage, AuthForm } from "@/app/components/auth";

export default function SignInPage() {
  const { user, loading } = useAuth();

  return (
    <AuthPage loading={loading} user={user}>
      <AuthForm mode="signIn" onSubmit={handleSignIn} />
    </AuthPage>
  );
}
```

### Props Reference

#### AuthLayout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | `boolean` | required | Loading state from useAuth |
| `user` | `Object\|null` | required | User object from useAuth |
| `coupleId` | `string\|null` | required | Couple ID from useAuth |
| `loadingText` | `string` | `"Loading..."` | Custom loading text |
| `redirectTo` | `string` | `"/signin"` | Redirect when no user |
| `redirectToWithCouple` | `string` | `null` | Redirect when user has couple |
| `redirectToWithoutCouple` | `string` | `null` | Redirect when user lacks couple |

#### AuthPage Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | `boolean` | required | Loading state from useAuth |
| `user` | `Object\|null` | required | User object from useAuth |
| `children` | `ReactNode` | required | Page content to render |

#### AuthForm Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `"signIn"\|"signUp"\|"update"` | `"signIn"` | Form mode |
| `onSubmit` | `Function` | required | Form submission handler |
| `onSwitchMode` | `Function` | `undefined` | Callback for switching modes |

## Error Handling

Firebase auth errors are mapped to user-friendly messages in `lib/authErrors.js`:

```javascript
import { getAuthErrorMessage } from "@/lib/authErrors";

// Usage
try {
  await signInWithEmailAndPassword(auth, email, password);
} catch (error) {
  const message = getAuthErrorMessage(error.code);
  toast.error(message);
}
```

### Error Code Mappings

| Firebase Code | User Message |
|--------------|-------------|
| `auth/user-not-found` | No account found with this email |
| `auth/wrong-password` | Incorrect password |
| `auth/invalid-credential` | Invalid email or password |
| `auth/too-many-requests` | Too many failed attempts. Please try again later |
| `auth/network-request-failed` | Network error. Please check your connection |
| `auth/invalid-email` | Please enter a valid email address |
| `auth/weak-password` | Password must be at least 6 characters |
| `auth/email-already-in-use` | This email is already registered |

## User Flow

### Sign Up Flow

```
1. User visits /signup
2. AuthPage checks if user is logged in
   - If logged in → redirect to /scrolls
   - If not logged in → show signup form
3. User fills form (email, password, displayName, confirmPassword)
4. Client-side validation (toast on error)
5. Firebase: createUserWithEmailAndPassword
6. Firebase: updateProfile (displayName)
7. Server Action: createUserDocument (create user profile in Firestore)
8. Toast success message
9. Redirect to /couple/create
```

### Sign In Flow

```
1. User visits /signin
2. AuthPage checks if user is logged in
   - If logged in → redirect to /scrolls
   - If not logged in → show signin form
3. User fills form (email, password)
4. Client-side validation (toast on error)
5. Firebase: signInWithEmailAndPassword
6. Toast success message
7. useAuth fetches user profile (coupleId)
8. Redirect based on coupleId
   - If has coupleId → /scrolls
   - If no coupleId → /couple/create
```

### Create Couple Flow

```
1. User visits /couple/create
2. AuthLayout checks authentication
   - If loading → show loading spinner
   - If no user → redirect to /signin
   - If has user but no coupleId → show form
3. User enters couple name
4. API call to /api/couple (POST)
5. Server creates couple in Firestore
6. Server updates user's coupleId
7. Toast success message
8. Redirect to /couple
```

### Join Couple Flow

```
1. User visits /couple/join
2. AuthLayout checks authentication
   - If loading → show loading spinner
   - If no user → redirect to /signin
   - If has user but no coupleId → show form
3. User enters 6-character invite code
4. API call to /api/couple/join (POST)
5. Server validates invite code
6. Server adds user to couple's memberIds
7. Server updates user's coupleId
8. Toast success message
9. Redirect to /couple
```

## API Endpoints

### Authentication

All API endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <firebase_id_token>
```

### /api/couple

| Method | Description |
|--------|-------------|
| GET | Get current user's couple info |
| POST | Create a new couple |

### /api/couple/join

| Method | Description |
|--------|-------------|
| POST | Join an existing couple via invite code |

### /api/couple/partner

| Method | Description |
|--------|-------------|
| GET | Get partner info (requires coupleId and excludeUid) |

### /api/fetch-scrolls

| Method | Description |
|--------|-------------|
| GET | Fetch all scrolls for the user's couple |

### /api/fetch-random

| Method | Description |
|--------|-------------|
| GET | Fetch a random scroll from the user's couple |

## Security

### Client-Side vs Server-Side

- **Client-Side (Firebase SDK)**: Used only for authentication state via `onAuthStateChanged`
- **Server-Side (Admin SDK)**: All database operations use `adminDb` which bypasses Firestore security rules

This pattern ensures that:
1. Security rules are enforced in production
2. Server-side code can access all data needed for the application
3. Client-side code only authenticates users, never directly accesses Firestore

### Data Model

See `tasks.md` for complete data model documentation.

## Troubleshooting

### Infinite Loop Issues

If you experience infinite loops:

1. **Don't call `router.push()` during render** - Use `useEffect` for navigation
2. **Check dependency arrays** - Ensure stable references in hooks
3. **Verify useAuth is being used correctly** - Don't create duplicate auth listeners

### "Missing or insufficient permissions"

This error occurs when:
1. Client-side Firestore queries are used (should use server actions)
2. Firebase rules are blocking access (server actions bypass this)

Solution: Ensure all data access goes through:
- Server Actions (`"use server"`)
- API Routes (`/api/*`)
- Never directly import `getFirestore()` in client components

### Loading State Never Resolves

Check that:
1. `onAuthStateChanged` is properly unsubscribed in cleanup
2. Server action `getUserWithAuth` is not throwing errors
3. Environment variables for Firebase Admin are set correctly