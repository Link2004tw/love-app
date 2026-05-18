"use server";

import { adminAuth } from "@/lib/admin-firebase";
import { createCouple, getCouple, joinCouple, getPartnerInfo } from "@/lib/couple";
import { updateUserCoupleId } from "./userAction";
import { getUserData } from "@/lib/api-utils";

export async function createCoupleAction(formData) {
  const idToken = formData.get("idToken");

  if (!idToken || typeof idToken !== "string") {
    return { error: "Authentication required" };
  }

  const name = formData.get("name");

  if (!name || typeof name !== "string" || !name.trim()) {
    return { error: "Couple name is required" };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const couple = await createCouple(name.trim(), userId);
    await updateUserCoupleId(userId, couple.id);

    return { success: true, couple: { id: couple.id, name: name.trim(), inviteCode: couple.inviteCode } };
  } catch (error) {
    console.error("Error creating couple via action:", error);

    if (error.code === "auth/invalid-token" || error.code === "auth/argument-error") {
      return { error: "Session expired. Please sign in again." };
    }

    return { error: "Failed to create couple. Please try again." };
  }
}

export async function joinCoupleAction(formData) {
  const idToken = formData.get("idToken");

  if (!idToken || typeof idToken !== "string") {
    return { error: "Authentication required" };
  }

  const inviteCode = formData.get("inviteCode");

  if (!inviteCode || typeof inviteCode !== "string") {
    return { error: "Invite code is required" };
  }

  const code = inviteCode.trim().toUpperCase();

  if (code.length !== 6) {
    return { error: "Invite code must be 6 characters" };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const result = await joinCouple(code, userId);

    if (result.error) {
      return { error: result.error };
    }

    await updateUserCoupleId(userId, result.id);

    return { success: true, couple: { id: result.id, name: result.name } };
  } catch (error) {
    console.error("Error joining couple via action:", error);

    if (error.code === "auth/invalid-token" || error.code === "auth/argument-error") {
      return { error: "Session expired. Please sign in again." };
    }

    return { error: "Failed to join couple. Please try again." };
  }
}

export async function getCoupleAction(idToken) {
  if (!idToken || typeof idToken !== "string") {
    return { error: "Authentication required" };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const userResult = await getUserData(userId);
    if (userResult.error) {
      return { error: userResult.error };
    }

    const { data: userData } = userResult;

    if (!userData.coupleId) {
      return { error: "No couple found", hasCouple: false };
    }

    const couple = await getCouple(userData.coupleId);
    if (!couple) {
      return { error: "Couple not found" };
    }

    return { success: true, couple, hasCouple: true };
  } catch (error) {
    console.error("Error getting couple:", error);
    if (error.code === "auth/invalid-token" || error.code === "auth/argument-error") {
      return { error: "Session expired. Please sign in again." };
    }
    return { error: "Failed to get couple. Please try again." };
  }
}

export async function getPartnerAction(idToken) {
  if (!idToken || typeof idToken !== "string") {
    return { error: "Authentication required" };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const userResult = await getUserData(userId);
    if (userResult.error) {
      return { error: userResult.error };
    }

    const { data: userData } = userResult;

    if (!userData.coupleId) {
      return { error: "No couple found" };
    }

    const partner = await getPartnerInfo(userData.coupleId, userId);
    return { success: true, partner };
  } catch (error) {
    console.error("Error getting partner:", error);
    if (error.code === "auth/invalid-token" || error.code === "auth/argument-error") {
      return { error: "Session expired. Please sign in again." };
    }
    return { error: "Failed to get partner. Please try again." };
  }
}