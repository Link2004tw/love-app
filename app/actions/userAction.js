"use server";

import { adminDb } from "@/lib/admin-firebase";

export async function createUserDocument(uid, email, displayName) {
  try {
    const userRef = adminDb.collection("users").doc(uid);
    await userRef.set({
      uid,
      email,
      displayName,
      coupleId: null,
      createdAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error creating user document:", error);
    return { error: "Failed to create user document" };
  }
}

export async function getUserDocument(uid) {
  try {
    const userDoc = await adminDb.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return null;
    }
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    console.error("Error getting user document:", error);
    return null;
  }
}

export async function updateUserCoupleId(uid, coupleId) {
  try {
    await adminDb.collection("users").doc(uid).update({ coupleId });
    return { success: true };
  } catch (error) {
    console.error("Error updating user coupleId:", error);
    return { error: "Failed to update couple connection" };
  }
}

export async function getUserWithAuth(uid) {
  try {
    const userDoc = await adminDb.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return null;
    }
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    console.error("Error fetching user with admin:", error);
    return null;
  }
}