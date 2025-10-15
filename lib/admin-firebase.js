// lib/firebase-admin.js
// Firebase Admin setup for Lili’s heartfelt app 💖 – robust with env variables

import { initializeApp, getApps, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
//import serviceAccount from "../k.json";
let app;
if (!process.env.FIREBASE_PROJECT_ID) {
  throw new Error(
    "Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID in environment variables"
  );
}
if (!process.env.FIREBASE_CLIENT_EMAIL) {
  throw new Error("Missing FIREBASE_CLIENT_EMAIL in environment variables");
}
if (!process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error("Missing FIREBASE_PRIVATE_KEY in environment variables");
}
if (!process.env.FIREBASE_STORAGE_BUCKET) {
  throw new Error("Missing FIREBASE_STORAGE_BUCKET in environment variables");
}
// Initialize Firebase Admin only if no app exists

const o = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

if (!getApps().length) {
  try {
    app = initializeApp({
      credential: cert(o),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    throw error; // Ensure the error is propagated
  }
} else {
  app = getApp(); // Use existing app if already initialized
}

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);
