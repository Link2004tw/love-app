import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  throw new Error(
    "Missing NEXT_PUBLIC_FIREBASE_API_KEY in environment variables"
  );
}
if (!process.env.NEXT_PUBLIC_AUTH_DOMAIN) {
  throw new Error("Missing NEXT_PUBLIC_AUTH_DOMAIN in environment variables");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  throw new Error(
    "Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID in environment variables"
  );
}
if (!process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID) {
  throw new Error(
    "Missing NEXT_PUBLIC_MESSAGING_SENDER_ID in environment variables"
  );
}
if (!process.env.NEXT_PUBLIC_FIREBASE_APP_ID) {
  throw new Error(
    "Missing NEXT_PUBLIC_FIREBASE_APP_ID in environment variables"
  );
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
