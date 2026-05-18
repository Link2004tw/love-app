import { adminAuth, adminDb } from "@/lib/admin-firebase";

export const ERROR_MESSAGES = {
  MISSING_TOKEN: "Authentication required. Please sign in again.",
  INVALID_TOKEN: "Your session has expired. Please sign in again.",
  TOKEN_VERIFICATION_FAILED: "Unable to verify your identity. Please sign in again.",
  USER_NOT_FOUND: "User profile not found. Please sign in again.",
  NO_COUPLE: "You need to join a couple before viewing scrolls.",
  NO_SCROLLS: "No scrolls found in your collection.",
  NO_SCROLLS_OF_TYPE: "No scrolls of this type yet. Create one!",
  NO_PARTNER_SCROLLS: "All scrolls are from you. Ask your partner to add some!",
  DATABASE_ERROR: "Unable to load data. Please try again.",
  UNKNOWN_ERROR: "Something went wrong. Please try again.",
  COUPLE_NOT_FOUND: "Couple not found.",
  COUPLE_NAME_REQUIRED: "Couple name is required.",
  INVITE_CODE_REQUIRED: "Invite code is required.",
  INVALID_INVITE_CODE: "Invalid invite code.",
  ALREADY_MEMBER: "You are already a member of this couple.",
  COUPLE_FULL: "This couple is full.",
  COUPLE_ENCRYPTION_ERROR: "Couple encryption not initialized.",
};

export function createResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function logError(context, error, details = {}) {
  console.error(`[API] ${context}:`, {
    message: error.message,
    code: error.code,
    stack: error.stack,
    ...details,
  });
}

export function logInfo(context, message, details = {}) {
  console.info(`[API] ${context}: ${message}`, details);
}

export async function verifyAuth(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: ERROR_MESSAGES.MISSING_TOKEN, status: 401, code: "MISSING_TOKEN" };
  }

  const token = authHeader.split("Bearer ")[1];

  if (!token) {
    return { error: ERROR_MESSAGES.INVALID_TOKEN, status: 401, code: "INVALID_TOKEN" };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return { userId: decodedToken.uid, token: decodedToken };
  } catch (error) {
    if (
      error.code === "auth/argument-error" ||
      error.code === "auth/invalid-credential" ||
      error.code === "auth/id-token-expired" ||
      error.code === "auth/id-token-revoked"
    ) {
      return { error: ERROR_MESSAGES.INVALID_TOKEN, status: 401, code: "INVALID_TOKEN" };
    }

    if (error.code === "auth/network-request-failed") {
      return { error: "Network error. Please check your connection.", status: 503, code: "NETWORK_ERROR" };
    }

    return { error: ERROR_MESSAGES.UNKNOWN_ERROR, status: 500, code: "UNKNOWN_ERROR" };
  }
}

export async function getUserData(userId) {
  const userDoc = await adminDb.collection("users").doc(userId).get();

  if (!userDoc.exists) {
    return { error: ERROR_MESSAGES.USER_NOT_FOUND, status: 404, code: "USER_NOT_FOUND" };
  }

  return { data: userDoc.data(), doc: userDoc };
}

export async function getCoupleData(coupleId) {
  const coupleDoc = await adminDb.collection("couples").doc(coupleId).get();

  if (!coupleDoc.exists) {
    return { error: ERROR_MESSAGES.COUPLE_NOT_FOUND, status: 404, code: "COUPLE_NOT_FOUND" };
  }

  return { data: { id: coupleDoc.id, ...coupleDoc.data() }, doc: coupleDoc };
}

export function handleAuthError(error) {
  logError("AUTH", error);

  if (error.status) {
    return createResponse({ error: error.error }, error.status);
  }

  if (
    error.code === "auth/argument-error" ||
    error.code === "auth/invalid-credential" ||
    error.code === "auth/id-token-expired" ||
    error.code === "auth/id-token-revoked"
  ) {
    return createResponse({ error: ERROR_MESSAGES.INVALID_TOKEN }, 401);
  }

  if (error.code === "auth/network-request-failed") {
    return createResponse({ error: "Network error. Please check your connection." }, 503);
  }

  return createResponse({ error: ERROR_MESSAGES.UNKNOWN_ERROR }, 500);
}

export function createErrorResponse(message, status = 500, code = "UNKNOWN_ERROR") {
  return createResponse({ error: message, code }, status);
}

export const API_TAGS = {
  SCROLLS: "Scrolls",
  COUPLE: "Couple",
  AUTH: "Authentication",
};

export const SECURITY_SCHEMES = {
  bearerAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "Firebase ID token",
  },
};