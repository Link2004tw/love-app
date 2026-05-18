# Love Jar

A digital scrapbook app for couples to collect, organize, and cherish meaningful moments together. All content is end-to-end encrypted.

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account
- Cloudinary account

### Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd loving-app

# Install dependencies
npm install
```

### Environment Setup

1. **Copy the example environment file:**
```bash
cp .env.example .env
```

2. **Set up Firebase:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing one
   - Enable **Authentication** → Email/Password
   - Enable **Firestore Database**
   - Go to Project Settings → Service Accounts → Generate new private key
   - Copy the following values:
     - Project ID
     - Client email
     - Private key (paste as single line, replace `\n` with actual newlines)
     - Storage bucket

3. **Set up Cloudinary:**
   - Go to [Cloudinary Dashboard](https://cloudinary.com/console)
   - Copy your:
     - Cloud name
     - API Key
     - API Secret

4. **Fill in your `.env` file:**
```env
# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app

# Firebase Client (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_AUTH_DOMAIN=your_project_id.firebaseapp.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Internal
FIREBASE_PRIVATE_ID=your_private_id
```

### Firebase Setup Checklist

- [ ] Create Firebase project
- [ ] Enable Email/Password authentication
- [ ] Create Firestore database (start in test mode, then secure)
- [ ] Add Web app to Firebase project
- [ ] Generate Admin SDK private key
- [ ] Add environment variables to `.env`

### Cloudinary Setup Checklist

- [ ] Create Cloudinary account
- [ ] Copy Cloud name, API Key, API Secret
- [ ] Update `.env` with credentials

---

## Local Development

### Start Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run start
```

---

## Deployment to Vercel

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Add environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.example`
6. Click "Deploy"

### Required Environment Variables on Vercel

| Variable | Description |
|----------|-------------|
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email |
| `FIREBASE_PRIVATE_KEY` | Private key (with `\n` for newlines) |
| `FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key (public) |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID (public) |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `NEXT_PUBLIC_AUTH_DOMAIN` | Firebase auth domain |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
loving-app/
├── app/                    # Next.js App Router
│   ├── actions/            # Server actions
│   ├── api/                # API routes
│   ├── components/         # React components
│   ├── couple/             # Couple management pages
│   ├── create/             # Create scroll pages
│   ├── scrolls/            # View scroll pages
│   └── hooks/              # Custom React hooks
├── lib/                    # Utility libraries
├── models/                 # Data models
├── public/                 # Static assets
├── .env.example            # Environment template
└── package.json
```

---

## Features

- **End-to-end encryption** - Scroll content is encrypted with AES-256-GCM
- **Couple management** - Create or join a couple with invite codes
- **5 scroll types** - Moment, Poem, Lyric, Verse, Affirmation
- **Random scroll discovery** - Get surprised with a random scroll from your partner
- **Image uploads** - Upload moments with photos via Cloudinary
- **API documentation** - Swagger UI at `/api/docs`

---

## API Documentation

Interactive API documentation is available at `/api/docs` when running the server.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/fetch-scrolls` | Get all scrolls |
| GET | `/api/fetch-random` | Get random scroll |
| GET | `/api/couple` | Get couple info |
| POST | `/api/couple` | Create couple |
| POST | `/api/couple/join` | Join couple |
| GET | `/api/couple/partner` | Get partner info |

---

## Troubleshooting

### "Firebase Admin initialized successfully" error on build
This is normal - Firebase Admin SDK initializes during build time.

### "Missing FIREBASE_* in environment variables"
Make sure your `.env` file exists and has all required variables. Restart the dev server after changes.

### Scroll content shows "[Decryption failed]"
The encryption key may be missing. Try:
1. Check if couple has `encryptionKey` in Firestore
2. Re-login to refresh auth state
3. Existing scrolls before encryption was added will show this

### Build fails with turbopack warning
The warning is informational. If it bothers you, update `next.config.mjs`:
```javascript
turbopack: {
  root: process.cwd(),
},
```

### "No scrolls found" but scrolls exist
- Check if you're viewing partner's scrolls only (`excludeSelf=true`)
- Verify you have a `coupleId` in your user document
- Check Firestore security rules allow access

---

## Firebase Security Rules (Recommended)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Couples - only members can read/write
    match /couples/{coupleId} {
      allow read, write: if request.auth.uid in resource.data.memberIds;
    }
    
    // Scrolls - only couple members can read/write
    match /love-scrolls/{scrollId} {
      allow read, write: if request.auth.uid in get(/databases/$(database)/documents/couples/$(resource.data.coupleId)).data.memberIds;
    }
  }
}
```

---

## License

MIT License - feel free to use and modify.

---

*Built with love for couples everywhere*