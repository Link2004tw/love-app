// lib/firebase-admin.js
// Firebase Admin setup for Lili’s heartfelt app 💖 – robust with env variables

import { initializeApp, getApps, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Validate environment variables
const requiredEnvVars = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "FIREBASE_STORAGE_BUCKET",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing ${envVar} in environment variables`);
  }
}

// Prepare credentials object
const credentials = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

// Initialize Firebase Admin
let app;
if (!getApps().length) {
  try {
    app = initializeApp({
      credential: cert(credentials),
      storageBucket: storageBucket,
    });
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    throw error; // Propagate the error for debugging
  }
} else {
  app = getApp(); // Use existing app if already initialized
  console.log("Using existing Firebase Admin app");
}

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);
