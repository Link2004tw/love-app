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

## Phase 8: Feature Enhancements - PENDING

### 8.1 Scroll Management
- [ ] **8.1.1** Add scroll editing capability
  - Create `app/api/scrolls/[id]/route.js` - Update/delete scroll API
  - Add edit button to scroll display
  - Create edit form modal/page

- [ ] **8.1.2** Add scroll deletion capability
  - Confirm before delete
  - Soft delete vs hard delete decision
  - Delete confirmation toast

- [ ] **8.1.3** Add scroll favorites
  - Add `isFavorite` boolean to scroll model
  - Create `app/api/scrolls/favorites/route.js` - Fetch favorite scrolls
  - Create toggle favorite button
  - Add favorites section to scrolls page

- [x] **8.1.4** Add scroll tags ✅ DONE (Added to tasks, pending implementation)

### 8.2 Advanced Features
- [ ] **8.2.1** Add scroll search
  - Full-text search on scroll content
  - Filter by type, date, author
  - Search results page

- [ ] **8.2.2** Add scroll sharing
  - Generate shareable link
  - Copy link to clipboard
  - Expiration settings

- [ ] **8.2.3** Add scroll analytics
  - Track scroll views
  - Most viewed scrolls
  - Scroll creation trends

### 8.3 Graph Database Integration
- [ ] **8.3.1** Push graph to Neo4j
  - Generate Cypher file from graphify output
  - Create Neo4j import script
  - Setup Neo4j connection
  - Real-time sync option

### 8.4 User Experience Improvements
- [ ] **8.4.1** Add scroll notifications
  - Notify partner when scroll created
  - Notification preferences
  - In-app notification center

- [ ] **8.4.2** Add scroll reminders
  - Schedule daily/weekly scroll viewing
  - Email reminders
  - Reminder customization

- [ ] **8.4.3** Add dark mode toggle
  - Theme preference storage
  - System preference detection
  - Smooth theme transition

- [ ] **8.4.4** Add onboarding tutorial
  - First-time user flow
  - Feature highlights
  - Skip option

### 8.6 Encryption - ✅ DONE
- [x] **8.6.1** Add AES-256-GCM encryption for scroll content
  - Create `lib/crypto.js` with encrypt/decrypt functions
  - Use AES-256-GCM with random IV and auth tag
- [x] **8.6.2** Generate and store encryption key per couple
  - Generate key on couple creation
  - Store key in couple document
  - Pass key to partner on join
- [x] **8.6.3** Encrypt scroll content on creation
  - Update `addingAction.js` to encrypt before storing
  - Update `Scroll` model to use `encryptedContent`
- [x] **8.6.4** Decrypt scroll content on display
  - Update `fetch-scrolls` API to decrypt
  - Update `fetch-random` API to decrypt
  - Client receives plaintext content

### 8.7 Performance & Security
- [ ] **8.5.1** Add scroll pagination
  - Lazy loading for scroll lists
  - Infinite scroll option
  - Page size configuration

- [ ] **8.5.2** Add rate limiting
  - API rate limits
  - Per-user throttling
  - Rate limit exceeded handling

- [ ] **8.5.3** Add input sanitization
  - XSS prevention
  - SQL injection prevention (Firestore)
  - Content length limits

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