// lib/firebase-admin.js
// Firebase Admin setup for Lili’s heartfelt app 💖 – robust with env variables

import { initializeApp, getApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
//import serviceAccount from "@/key.json";

let app;
// Initialize Firebase Admin only if no app exists
console.log(getApps().length);
if (!getApps().length) {
  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
    //databaseURL: "https://solarfarmsystem-default-rtdb.firebaseio.com",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);
