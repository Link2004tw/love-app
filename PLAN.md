# Love Jar - Project Documentation

## 1. Project Overview

### Description
Love Jar is a digital scrapbook app for couples to collect, organize, and cherish meaningful moments together. Partners create "scrolls" (messages, memories, poems, lyrics, verses, affirmations) that can be discovered randomly. All content is end-to-end encrypted using AES-256-GCM.

### Tech Stack
| Category | Technology |
|----------|------------|
| Framework | Next.js 16.2.6 (App Router) |
| Language | React 19.1.0, JavaScript |
| Styling | Tailwind CSS 4 |
| Authentication | Firebase Auth (Email/Password) |
| Database | Firebase Firestore |
| File Storage | Cloudinary |
| Notifications | react-hot-toast |
| Validation | Zod |
| API Docs | Swagger UI |
| Deployment | Vercel |

### Target Users
Couples (romantic partners) who want a private digital space to store meaningful moments, messages, and memories together.

---

## 2. Architecture

### System Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   React     │  │   Tailwind  │  │   Firebase SDK (Auth)   │  │
│  │   Next.js   │  │   CSS 4     │  │   - signInWithEmail      │  │
│  │   App Router│  │             │  │   - getIdToken()         │  │
│  └──────┬──────┘  └─────────────┘  └───────────┬─────────────┘  │
│         │                                      │                 │
│         │         ┌─────────────┐              │                 │
│         └────────►│   useAuth   │◄─────────────┘                 │
│                   │   Hook      │                              │
│                   └──────┬──────┘                              │
└──────────────────────────┼──────────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER (Vercel)                      │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     API Routes                          │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │    │
│  │  │ /api/couple  │  │ /api/fetch-  │  │ /api/couple/ │  │    │
│  │  │              │  │   scrolls    │  │    join      │  │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                  │
│                   ┌──────────┴──────────┐                      │
│                   ▼                      ▼                      │
│  ┌───────────────────────┐  ┌───────────────────────┐         │
│  │   Firebase Admin SDK  │  │   Cloudinary SDK      │         │
│  │   (Server-side)        │  │   (Image uploads)     │         │
│  │   - verifyIdToken()    │  │   - upload_stream()   │         │
│  │   - adminDb            │  │                      │         │
│  └───────────┬───────────┘  └───────────────────────┘         │
│              │                                                  │
│              ▼                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   FIRESTORE DATABASE                     │   │
│  │  ┌─────────┐    ┌─────────┐    ┌───────────────┐        │   │
│  │  │  users  │    │ couples │    │ love-scrolls  │        │   │
│  │  └─────────┘    └─────────┘    └───────────────┘        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow (Scroll Creation)
```
┌────────┐    ┌────────────┐    ┌──────────────┐    ┌─────────────┐
│ Client │───►│  /create/* │───►│ addingAction │───►│  encrypt()  │
│  Form  │    │   Page     │    │  (Server)    │    │  (AES-256)  │
└────────┘    └────────────┘    └──────┬───────┘    └──────┬──────┘
                                       │                    │
                                       ▼                    ▼
┌────────┐    ┌────────────┐    ┌──────────────┐    ┌─────────────┐
│Toast   │◄───│  Redirect  │◄───│   Firestore  │◄───│ Encrypted   │
│Notify  │    │            │    │   .add()     │    │   Content   │
└────────┘    └────────────┘    └──────────────┘    └─────────────┘
```

### Auth Flow
```
┌──────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION FLOW                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────┐      ┌──────────┐      ┌──────────────┐               │
│   │ Sign │─────►│ Firebase │─────►│   Create/    │               │
│   │  Up  │      │  Auth    │      │   Verify     │               │
│   └──────┘      └────┬─────┘      └──────┬───────┘               │
│                      │                   │                        │
│                      ▼                   ▼                        │
│              ┌──────────────┐    ┌──────────────┐                │
│              │  Firebase    │    │  Firestore   │                │
│              │  User UID    │    │  User Doc    │                │
│              └──────┬───────┘    └──────┬───────┘                │
│                     │                   │                        │
│                     ▼                   ▼                        │
│              ┌──────────────────────────────────┐                │
│              │          useAuth Hook            │                │
│              │  - user (Firebase user)          │                │
│              │  - coupleId (from Firestore)     │                │
│              │  - encryptionKey                 │                │
│              └───────────────┬──────────────────┘                │
│                              │                                    │
│              ┌───────────────┼───────────────┐                   │
│              ▼               ▼               ▼                   │
│        ┌─────────┐   ┌───────────┐   ┌────────────┐            │
│        │No User  │   │No coupleId│   │Has coupleId│            │
│        │ Redirect│   │Redirect   │   │Show pages  │            │
│        │ /signin │   │/couple/*  │   │/scrolls/*  │            │
│        └─────────┘   └───────────┘   └────────────┘            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Encryption Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                     ENCRYPTION FLOW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Couple Creation:                                                │
│  ┌───────────────┐      ┌───────────────┐      ┌─────────────┐  │
│  │ createCouple  │─────►│ generateKey() │─────►│ Store in    │  │
│  │               │      │ (32-byte key) │      │ couples[id] │  │
│  └───────────────┘      └───────────────┘      └─────────────┘  │
│                                                                  │
│  Partner Joins:                                                  │
│  ┌───────────────┐      ┌───────────────┐      ┌─────────────┐  │
│  │ Get couple    │─────►│ Get key from  │─────►│ Store key   │  │
│  │               │      │ couples doc   │      │ in user doc │  │
│  └───────────────┘      └───────────────┘      └─────────────┘  │
│                                                                  │
│  Create Scroll:                                                  │
│  ┌───────────────┐      ┌───────────────┐      ┌─────────────┐  │
│  │ Plain content │─────►│ encrypt(key)  │─────►│ Store {     │  │
│  │               │      │ AES-256-GCM   │      │   iv,       │  │
│  │               │      │               │      │   authTag,  │  │
│  │               │      │               │      │   data      │  │
│  └───────────────┘      └───────────────┘      └─────────────┘  │
│                                                                  │
│  Read Scroll:                                                    │
│  ┌───────────────┐      ┌───────────────┐      ┌─────────────┐  │
│  │ Fetch { iv,   │─────►│ decrypt(key)   │─────►│ Plain text  │  │
│  │   authTag,    │      │ AES-256-GCM   │      │ to client   │  │
│  │   data }      │      │               │      │             │  │
│  └───────────────┘      └───────────────┘      └─────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Project Structure

```
loving-app/
│
├── app/                           # Next.js App Router
│   ├── actions/                   # Server Actions
│   │   ├── addingAction.js        # Create scroll (encrypted, Cloudinary)
│   │   └── userAction.js          # User CRUD operations
│   │
│   ├── api/                       # API Routes (Server)
│   │   ├── couple/
│   │   │   ├── route.js           # GET/POST couple
│   │   │   ├── join/route.js      # POST join couple
│   │   │   └── partner/route.js   # GET partner info
│   │   ├── fetch-random/           # GET random scroll
│   │   ├── fetch-scrolls/          # GET all scrolls
│   │   └── docs/route.js          # Swagger UI
│   │
│   ├── components/
│   │   ├── auth/                  # Auth components
│   │   │   ├── AuthForm.jsx       # Sign in/up form
│   │   │   ├── AuthLayout.jsx     # Protected wrapper
│   │   │   └── index.js           # Barrel export
│   │   │
│   │   ├── layout/                # Layout components
│   │   │   ├── Navbar.jsx         # Top navigation
│   │   │   └── AuthProvidor.jsx   # Auth state wrapper
│   │   │
│   │   ├── providers/
│   │   │   └── ToastProvider.jsx  # Toast notifications
│   │   │
│   │   └── ui/                    # Reusable UI
│   │       ├── PrimaryButton.jsx   # Main button
│   │       ├── ScrollCard.jsx      # Scroll type card
│   │       ├── ScrollFrom.jsx      # Create scroll form
│   │       └── FetchScroll.jsx     # Display random scroll
│   │
│   ├── hooks/
│   │   └── useAuth.js             # Auth state hook
│   │
│   ├── couple/                    # Couple pages
│   │   ├── page.jsx               # Couple dashboard
│   │   ├── create/page.jsx        # Create couple
│   │   └── join/page.jsx          # Join couple
│   │
│   ├── create/                    # Create scroll pages
│   │   ├── page.jsx               # Create hub
│   │   ├── moment/page.jsx         # Create moment
│   │   ├── poem/page.jsx          # Create poem
│   │   ├── lyric/page.jsx         # Create lyric
│   │   ├── verse/page.jsx         # Create verse
│   │   └── words-of-affirmation/  # Create affirmation
│   │
│   ├── scrolls/                   # View scroll pages
│   │   ├── page.jsx               # Scrolls hub
│   │   ├── moment/page.jsx         # View moment
│   │   ├── poem/page.jsx          # View poem
│   │   ├── lyrics/page.jsx        # View lyric
│   │   ├── verse/page.jsx         # View verse
│   │   └── affirmation/page.jsx   # View affirmation
│   │
│   ├── signin/page.jsx            # Sign in page
│   ├── signup/page.jsx            # Sign up page
│   ├── profile/page.jsx           # User profile
│   ├── layout.jsx                 # Root layout
│   ├── page.jsx                   # Landing page
│   └── globals.css                # Global styles
│
├── lib/                           # Utility libraries
│   ├── admin-firebase.js          # Firebase Admin SDK
│   ├── firebase.js                # Firebase Client SDK
│   ├── couple.js                  # Couple helper functions
│   ├── crypto.js                  # AES-256-GCM encryption
│   ├── authErrors.js              # Auth error mappings
│   ├── api-utils.js               # Shared API utilities
│   └── swagger-options.js         # OpenAPI schema
│
├── models/                        # Data models
│   └── scroll.js                   # Scroll class
│
├── public/                        # Static assets
│
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore
├── package.json                   # Dependencies
├── tailwind.config.js             # Tailwind config
├── next.config.mjs                # Next.js config
├── vercel.json                    # Vercel config
├── tasks.md                       # Task tracker
└── PLAN.md                        # This file
```

---

## 4. Features & Pages

### Authentication Pages
| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Homepage with app description and CTAs based on auth state |
| Sign In | `/signin` | Email/password sign in using Firebase Auth |
| Sign Up | `/signup` | Account creation with display name |

### Couple Management
| Page | Route | Description |
|------|-------|-------------|
| Create Couple | `/couple/create` | Create new couple with generated invite code |
| Join Couple | `/couple/join` | Join existing couple using 6-char invite code |
| Couple Dashboard | `/couple` | View couple details, invite code, partner info |

### View Scrolls (Partner's Scrolls Only)
| Page | Route | Description |
|------|-------|-------------|
| Scrolls Hub | `/scrolls` | Main hub showing scroll type categories |
| View Moment | `/scrolls/moment` | View random moment scroll from partner |
| View Lyrics | `/scrolls/lyrics` | View random lyrics scroll from partner |
| View Verse | `/scrolls/verse` | View random Bible verse from partner |
| View Poem | `/scrolls/poem` | View random poem from partner |
| View Affirmation | `/scrolls/affirmation` | View random words of affirmation |

### Create Scrolls
| Page | Route | Description |
|------|-------|-------------|
| Create Hub | `/create` | Choose scroll type to create |
| Create Moment | `/create/moment` | Create moment with location, image, map link |
| Create Lyric | `/create/lyric` | Create lyric with song link |
| Create Verse | `/create/verse` | Create Bible verse with verse link |
| Create Poem | `/create/poem` | Create poem text |
| Create Affirmation | `/create/words-of-affirmation` | Create affirmation message |

### Other Pages
| Page | Route | Description |
|------|-------|-------------|
| Profile | `/profile` | View/edit display name, sign out |

---

## 5. Components

### Layout Components
```
┌─────────────────────────────────────────────────────────────┐
│                        NAVBAR                               │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌─────────────┐   │
│  │ Logo    │  │ Couple   │  │My Scrolls│  │Add Scroll   │   │
│  │ "Our    │  │ (if has  │  │ (if     │  │ (if auth)   │   │
│  │ Scrolls"│  │ couple)  │  │ auth)   │  │             │   │
│  └─────────┘  └──────────┘  └─────────┘  └─────────────┘   │
│                                ┌───────────────────────────┐ │
│                                │        Sign In/Up        │ │
│                                │        (if not auth)      │ │
│                                │        Sign Out          │ │
│                                │        (if auth)         │ │
│                                └───────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Auth Components
| Component | Purpose |
|-----------|---------|
| `AuthForm` | Reusable sign in/sign up form with validation |
| `AuthLayout` | Protected page wrapper - redirects if not authenticated |
| `AuthPage` | Auth page wrapper - redirects if already authenticated |

### UI Components
| Component | Purpose |
|-----------|---------|
| `PrimaryButton` | Main styled button with variants (default, outline, destructive) |
| `ScrollCard` | Scroll type selection card with icon and label |
| `ScrollFrom` | Form to create new scrolls (type-specific fields) |
| `FetchScroll` | Component to fetch and display random scroll from partner |

---

## 6. API Reference

### Endpoint Overview
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/couple` | GET | Yes | Get user's couple info |
| `/api/couple` | POST | Yes | Create new couple |
| `/api/couple/join` | POST | Yes | Join existing couple |
| `/api/couple/partner` | GET | Yes | Get partner information |
| `/api/fetch-scrolls` | GET | Yes | Get all scrolls for couple |
| `/api/fetch-random` | GET | Yes | Get random scroll |
| `/api/docs` | GET | No | Swagger UI documentation |

### Request Format
All authenticated endpoints require:
```
Authorization: Bearer <Firebase_ID_Token>
Content-Type: application/json
```

### Response Format
```javascript
// Success
{
  "message": "Description of result",
  "data": { ... },
  "count": 5,
  "duration": 45
}

// Error
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Common Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (missing params) |
| 401 | Unauthorized (invalid/missing token) |
| 404 | Not Found (resource doesn't exist) |
| 500 | Server Error |

---

## 7. Database Schema

### Firestore Collections Structure
```
┌──────────────────────────────────────────────────────────────────┐
│                         FIRESTORE DATABASE                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    users collection                         │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  Document ID: Firebase UID (e.g., "abc123xyz")       │  │  │
│  │  ├──────────────────────────────────────────────────────┤  │  │
│  │  │  uid: "abc123xyz"           (string)                │  │  │
│  │  │  email: "love@example.com"  (string)                │  │  │
│  │  │  displayName: "Jordan"      (string)                │  │  │
│  │  │  coupleId: "couple456"       (string | null)         │  │  │
│  │  │  createdAt: "2026-01-15..."  (ISO timestamp)         │  │  │
│  │  │  encryptionKey: "base64..."  (string, optional)     │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           │ coupleId                             │
│                           ▼                                      │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                   couples collection                       │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  Document ID: Couple ID (e.g., "couple456")          │  │  │
│  │  ├──────────────────────────────────────────────────────┤  │  │
│  │  │  name: "Alex & Jordan"        (string)                │  │  │
│  │  │  inviteCode: "ABC123"        (string, unique)        │  │  │
│  │  │  memberIds: ["abc123xyz",    (array of UIDs)         │  │
│  │  │                "def456uvw"]                          │  │  │
│  │  │  createdBy: "abc123xyz"      (string, UID)           │  │  │
│  │  │  createdAt: "2026-01-15..."  (ISO timestamp)         │  │  │
│  │  │  encryptionKey: "base64..."   (string)               │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           │ coupleId                             │
│                           ▼                                      │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                  love-scrolls collection                    │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  Document ID: Auto-generated (e.g., "scroll789")     │  │  │
│  │  ├──────────────────────────────────────────────────────┤  │  │
│  │  │  type: "Moment"              (string)               │  │  │
│  │  │  encryptedContent: {                                 │  │  │
│  │  │    iv: "base64...",          (16-byte IV)           │  │  │
│  │  │    authTag: "base64...",     (16-byte auth tag)      │  │  │
│  │  │    data: "base64encrypted"   (encrypted content)     │  │  │
│  │  │  }                                                    │  │  │
│  │  │  createdAt: "2026-01-15..."  (ISO timestamp)         │  │  │
│  │  │  username: "Alex"           (string)                │  │  │
│  │  │  userId: "abc123xyz"         (string, creator UID)   │  │  │
│  │  │  coupleId: "couple456"       (string)               │  │  │
│  │  │  imageUrl: "https://..."     (string | null)         │  │  │
│  │  │  location: "Paris, France"   (string | null)         │  │  │
│  │  │  songUrl: "https://..."     (string | null)         │  │  │
│  │  │  verseUrl: "https://..."    (string | null)         │  │  │
│  │  │  mapUrl: "https://..."      (string | null)         │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Scroll Types
| Type | Fields |
|------|--------|
| Moment | `content`, `imageUrl`, `location`, `mapUrl` |
| Lyric | `content`, `songUrl` |
| Verse | `content`, `verseUrl` |
| Poem | `content` |
| WordsOfAffirmation | `content` |

---

## 8. Security Features

### Encryption Details
```
Algorithm:    AES-256-GCM
Key Length:   32 bytes (256 bits)
IV Length:    16 bytes (128 bits)
Auth Tag:     16 bytes
Key Derivation: PBKDF2 with 100,000 iterations
```

### Security Flow Diagram
```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Key Generation (on couple creation)                          │
│     ┌────────────────┐                                          │
│     │ crypto.random  │                                          │
│     │ Bytes(32)     │────► Base64 Key ──────► Stored in        │
│     └────────────────┘                    couples.doc            │
│                                                                  │
│  2. Key Sharing (on partner join)                                │
│     ┌────────────────┐     ┌────────────────┐                  │
│     │ Get key from   │────►│ Update user    │                  │
│     │ couples.doc    │     │ .encryptionKey │                  │
│     └────────────────┘     └────────────────┘                  │
│                                                                  │
│  3. Encrypt (on create scroll)                                  │
│     ┌────────────────┐     ┌────────────────┐                  │
│     │ Get key from   │────►│ encrypt(content│                  │
│     │ couples.doc    │     │ .key)          │                  │
│     └────────────────┘     └───────┬────────┘                  │
│                                    │                           │
│                                    ▼                           │
│                              { iv, authTag, data }             │
│                                    │                           │
│                                    ▼                           │
│                              Firestore .add()                   │
│                                                                  │
│  4. Decrypt (on read scroll)                                    │
│     ┌────────────────┐     ┌────────────────┐                  │
│     │ Get key from   │────►│ decrypt(       │                  │
│     │ couples.doc    │     │ .encrypted,    │                  │
│     └────────────────┘     │ .key)          │                  │
│                            └───────┬────────┘                  │
│                                    │                           │
│                                    ▼                           │
│                              Plain content                      │
│                                    │                           │
│                                    ▼                           │
│                              Response to client                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Security Measures
| Measure | Implementation |
|---------|----------------|
| Server-side auth | Firebase Admin SDK verifies tokens on every API call |
| End-to-end encryption | AES-256-GCM with random IV per scroll |
| Key per couple | Shared secret key only accessible to couple members |
| No client-side keys | Encryption/decryption happens server-side only |
| HTTPS only | All traffic encrypted in transit |

---

## 9. Configuration

### Environment Variables
```env
# Firebase Admin (Server-side - private)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=project.firebasestorage.app

# Firebase Client (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_AUTH_DOMAIN=project.firebaseapp.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Internal
FIREBASE_PRIVATE_ID=a3afb83744ab2ec9d9782a5ca2e8d6e052ca1692
```

### Tailwind Theme Colors
| Name | Hex | Usage |
|------|-----|-------|
| love-pink | #FFB6C1 | Soft blush background |
| heart-red | #FF69B4 | Vibrant accent |
| whisper-gold | #FFD700 | Gold accents |
| romance-purple | #DDA0DD | Purple shadows |
| eternal-white | #FFF5EE | Creamy white |
| midnight-blue | #4B0082 | Night mode |

---

## 10. Appendix

### Error Codes
| Code | Description |
|------|-------------|
| MISSING_TOKEN | No Authorization header |
| INVALID_TOKEN | Token expired or invalid |
| USER_NOT_FOUND | User document not in Firestore |
| NO_COUPLE | User has no coupleId |
| COUPLE_NOT_FOUND | Couple document not found |
| NO_SCROLLS | No scrolls in collection |
| NO_PARTNER_SCROLLS | All scrolls are from self |
| INVALID_INVITE_CODE | Invite code doesn't exist |
| ALREADY_MEMBER | User already in couple |
| COUPLE_FULL | Couple already has 2 members |

### Swagger Documentation
Access interactive API documentation at: `/api/docs`

### File Count Summary
| Category | Count |
|----------|-------|
| Total Pages | 27 |
| API Routes | 7 |
| Components | 10 |
| Library Files | 7 |
| Models | 1 |

---

*Last Updated: May 2026*