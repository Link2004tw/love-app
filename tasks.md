# Tasks: Generalize Lili's Scrolls to Couple Scrolls

## Phase 1: Data Model (Firestore) - ✅ DONE

- [x] **1.1** Create `couples` collection schema
  - name (string)
  - inviteCode (string, unique)
  - memberIds (array of 2 uids)
  - createdBy (uid)
  - createdAt (timestamp)

- [x] **1.2** Update `users` collection to add `coupleId` field

- [x] **1.3** Update `scrolls` collection - add `coupleId` field (replace/augment userId)

## Phase 2: New Pages & Components - ✅ DONE

- [x] **2.1** Create `app/couple/create/page.jsx` - Create new couple, generate invite code

- [x] **2.2** Create `app/couple/join/page.jsx` - Join existing couple via code

- [x] **2.3** Create `app/couple/page.jsx` - View/manage couple (name, partner, invite code)

- [x] **2.4** Create `components/CoupleOnboarding.jsx` - First-login flow: create or join (handled in pages)

## Phase 3: Invite System - ✅ DONE

- [x] **3.1** Generate unique invite code on couple creation (e.g., UUID or random 6-char)

- [x] **3.2** Create `/join/[code]` route - partner enters code to join (implemented as /couple/join)

- [x] **3.3** Display invite code in couple settings for easy sharing

## Phase 4: API Updates - ✅ DONE

- [x] **4.1** Update `api/fetch-scrolls` to query by `coupleId` instead of `userId`

- [x] **4.2** Update `api/fetch-random` to query by `coupleId`

- [x] **4.3** Update `addingAction.js` to include `coupleId` when creating scroll

- [x] **4.4** Create new `api/couple` routes - Create couple, join couple, get couple info

## Phase 5: UI Generalization - Remove Lili References - ✅ DONE

- [x] **5.1** Update `app/page.jsx` - Remove "Lili's Scrolls", use generic "Our Scrolls"

- [x] **5.2** Update `app/components/auth/AuthForm.jsx` - Remove Lili love notes, use generic welcome

## Phase 6: Migration Strategy - ✅ DONE

- [x] **6.1** Handle existing users with `coupleId: null` - trigger onboarding on first login

- [x] **6.2** Handle existing scrolls - remain accessible to original user until migrated

- [ ] **6.3** Optional: Create default couple for existing data

## Phase 7: Auth Refactoring - ✅ DONE

- [x] **7.1** Add toast notifications with `react-hot-toast`
  - Install `react-hot-toast` package
  - Create `ToastProvider` component
  - Update all auth forms to show toast on success/error

- [x] **7.2** Better Firebase error handling
  - Create `lib/authErrors.js` with user-friendly error messages
  - Map Firebase error codes to readable messages

- [x] **7.3** Use Firebase Admin SDK for server-side operations
  - All server actions use `adminDb` from `@/lib/admin-firebase`
  - Bypass Firestore security rules on server
  - Add `getUserWithAuth` server action for client-side use

- [x] **7.4** Create reusable auth components
  - `AuthLayout` - Loading/redirect wrapper for protected pages
  - `AuthPage` - Wrapper for auth pages (signin/signup) that redirect logged-in users
  - `AuthForm` - Reusable form without router dependency

- [x] **7.5** Fix infinite loop issues
  - Use `useEffect` for navigation instead of direct `router.push()`
  - Proper cleanup with `isActive` flag in `useAuth`
  - Stable dependencies in hooks

## Key Technical Decisions ✅

1. Couple ID stored in user profile - retrieved on auth, passed to all queries
2. Scrolls belong to couple - both partners see all scrolls
3. Invite code not in URL - user must manually enter (more secure)
4. No public profile - couple data is private between members

---

## Files Created/Modified

### New Files
- `app/actions/userAction.js` - User document CRUD
- `lib/couple.js` - Couple helper functions
- `lib/authErrors.js` - Firebase auth error mappings
- `app/api/couple/route.js` - Create/get couple API
- `app/api/couple/join/route.js` - Join couple API
- `app/api/couple/partner/route.js` - Get partner info API
- `app/couple/create/page.jsx` - Create couple page
- `app/couple/join/page.jsx` - Join couple page
- `app/couple/page.jsx` - Couple management page
- `app/components/providers/ToastProvider.jsx` - Toast notification provider
- `app/components/auth/AuthLayout.jsx` - Auth layout wrapper component
- `app/components/auth/AuthForm.jsx` - Reusable auth form component
- `app/components/auth/index.js` - Auth components barrel export

### Modified Files
- `app/signup/page.jsx` - Create user document, redirect to couple create
- `app/signin/page.jsx` - Check coupleId and redirect appropriately
- `app/hooks/useAuth.js` - Add coupleId to auth state, proper cleanup
- `app/actions/addingAction.js` - Add coupleId to scrolls
- `app/api/fetch-scrolls/route.js` - Query by coupleId
- `app/api/fetch-random/route.js` - Query by coupleId
- `app/api/couple/route.js` - Use absolute import paths
- `app/layout.jsx` - Add ToastProvider
- `app/page.jsx` - Remove Lili references, add couple redirect
- `app/profile/page.jsx` - Remove Lili references
- `app/scrolls/page.jsx` - Remove Lili references, add couple check
- `app/create/page.jsx` - Add couple check
- `app/components/layout/Navbar.jsx` - Add couple link, rename to Our Scrolls
- `app/components/ui/ScrollFrom.jsx` - Remove Lili references
- `app/components/ui/FetchScroll.jsx` - Remove Lili references
- `app/scrolls/moment/page.jsx` - Remove Lili references
- `app/scrolls/poem/page.jsx` - Remove Lili references
- `app/scrolls/lyrics/page.jsx` - Remove Lili references
- `app/scrolls/verse/page.jsx` - Remove Lili references
- `app/scrolls/affirmation/page.jsx` - Remove Lili references
- `app/create/moment/page.jsx` - Remove Lili references
- `app/create/poem/page.jsx` - Remove Lili references
- `app/create/lyric/page.jsx` - Remove Lili references
- `app/create/verse/page.jsx` - Remove Lili references
- `app/create/words-of-affirmation/page.jsx` - Remove Lili references
- `tailwind.config.js` - Remove Lili comment
- `app/couple/create/page.jsx` - Use AuthLayout
- `app/couple/join/page.jsx` - Use AuthLayout
- `app/couple/page.jsx` - Use AuthLayout