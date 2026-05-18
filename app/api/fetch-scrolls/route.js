import { adminAuth, adminDb } from "@/lib/admin-firebase";
import { getCouple } from "@/lib/couple";
import { decrypt } from "@/lib/crypto";

const ERROR_MESSAGES = {
  MISSING_TOKEN: "Authentication required. Please sign in again.",
  INVALID_TOKEN: "Your session has expired. Please sign in again.",
  TOKEN_VERIFICATION_FAILED: "Unable to verify your identity. Please sign in again.",
  USER_NOT_FOUND: "User profile not found. Please sign in again.",
  NO_COUPLE: "You need to join a couple before viewing scrolls.",
  NO_SCROLLS: "No scrolls found in your collection.",
  NO_SCROLLS_OF_TYPE: "No scrolls of this type yet. Create one!",
  NO_PARTNER_SCROLLS: "All scrolls are from you. Ask your partner to add some!",
  DATABASE_ERROR: "Unable to load scrolls. Please try again.",
  UNKNOWN_ERROR: "Something went wrong. Please try again.",
};

function createResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function logError(context, error, details = {}) {
  console.error(`[fetch-scrolls] ${context}:`, {
    message: error.message,
    code: error.code,
    stack: error.stack,
    ...details,
  });
}

function logInfo(context, message, details = {}) {
  console.info(`[fetch-scrolls] ${context}: ${message}`, details);
}

export async function GET(request) {
  const startTime = Date.now();

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logError("AUTH", new Error("Missing authorization header"));
    return createResponse({ error: ERROR_MESSAGES.MISSING_TOKEN }, 401);
  }

  const token = authHeader.split("Bearer ")[1];

  if (!token) {
    logError("AUTH", new Error("Empty token after Bearer"));
    return createResponse({ error: ERROR_MESSAGES.INVALID_TOKEN }, 401);
  }

  try {
    logInfo("AUTH", "Verifying token");
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;
    logInfo("AUTH", `Token verified for user: ${userId}`);

    logInfo("DB", `Fetching user document: ${userId}`);
    const userDoc = await adminDb.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      logError("DB", new Error("User document not found"), { userId });
      return createResponse({ error: ERROR_MESSAGES.USER_NOT_FOUND }, 404);
    }

    const userData = userDoc.data();
    const coupleId = userData?.coupleId;

    if (!coupleId) {
      logError("AUTH", new Error("No couple ID for user"), { userId });
      return createResponse({ error: ERROR_MESSAGES.NO_COUPLE }, 400);
    }

    const couple = await getCouple(coupleId);
    const encryptionKey = couple?.encryptionKey;

    const { searchParams } = new URL(request.url);
    const typeFilter = searchParams.get("type");
    const excludeSelf = searchParams.get("excludeSelf") === "true";

    logInfo("DB", `Fetching scrolls for couple: ${coupleId}`, { typeFilter, excludeSelf });

    let querySnapshot;

    if (typeFilter) {
      querySnapshot = await adminDb
        .collection("love-scrolls")
        .where("coupleId", "==", coupleId)
        .where("type", "==", typeFilter)
        .get();
    } else {
      querySnapshot = await adminDb
        .collection("love-scrolls")
        .where("coupleId", "==", coupleId)
        .get();
    }

    let scrolls = [];
    querySnapshot.forEach((doc) => {
      scrolls.push({ id: doc.id, ...doc.data() });
    });

    if (excludeSelf) {
      const beforeCount = scrolls.length;
      scrolls = scrolls.filter((s) => s.userId !== userId);
      logInfo("FILTER", `Filtered ${beforeCount - scrolls.length} own scrolls, ${scrolls.length} partner scrolls remain`);
    }

    if (encryptionKey) {
      scrolls = scrolls.map((scroll) => {
        if (scroll.encryptedContent) {
          try {
            const content = decrypt(scroll.encryptedContent, encryptionKey);
            return { ...scroll, content };
          } catch (err) {
            logError("DECRYPT", err, { scrollId: scroll.id });
            return { ...scroll, content: "[Decryption failed]" };
          }
        }
        return scroll;
      });
    } else {
      scrolls = scrolls.map((scroll) => {
        if (!scroll.content && scroll.encryptedContent) {
          return { ...scroll, content: "[Key not found - please re-login]" };
        }
        return scroll;
      });
    }

    const duration = Date.now() - startTime;
    logInfo("SUCCESS", `Fetched ${scrolls.length} scrolls in ${duration}ms`, {
      coupleId,
      typeFilter,
      excludeSelf,
      count: scrolls.length,
    });

    if (scrolls.length === 0) {
      let message;
      if (excludeSelf && typeFilter) {
        message = ERROR_MESSAGES.NO_PARTNER_SCROLLS;
      } else if (typeFilter) {
        message = ERROR_MESSAGES.NO_SCROLLS_OF_TYPE;
      } else {
        message = ERROR_MESSAGES.NO_SCROLLS;
      }
      return createResponse(
        {
          message: "No scrolls found",
          scrolls: [],
          empty: true,
          emptyReason: excludeSelf ? "all_from_self" : typeFilter ? "no_type" : "no_scrolls",
        },
        200
      );
    }

    return createResponse(
      {
        message: `Found ${scrolls.length} scroll${scrolls.length !== 1 ? "s" : ""}`,
        scrolls,
        count: scrolls.length,
        duration,
      },
      200
    );
  } catch (error) {
    logError("REQUEST", error);

    if (
      error.code === "auth/argument-error" ||
      error.code === "auth/invalid-credential" ||
      error.code === "auth/id-token-expired" ||
      error.code === "auth/id-token-revoked"
    ) {
      return createResponse({ error: ERROR_MESSAGES.INVALID_TOKEN }, 401);
    }

    if (error.code === "auth/network-request-failed") {
      return createResponse(
        { error: "Network error. Please check your connection." },
        503
      );
    }

    return createResponse({ error: ERROR_MESSAGES.UNKNOWN_ERROR }, 500);
  }
}