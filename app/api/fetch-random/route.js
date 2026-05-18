import { adminAuth, adminDb } from "@/lib/admin-firebase";
import { getCouple } from "@/lib/couple";
import { decrypt } from "@/lib/crypto";

const ERROR_MESSAGES = {
  MISSING_TOKEN: "Authentication required. Please sign in again.",
  INVALID_TOKEN: "Your session has expired. Please sign in again.",
  USER_NOT_FOUND: "User profile not found. Please sign in again.",
  NO_COUPLE: "You need to join a couple before viewing scrolls.",
  NO_SCROLLS: "No scrolls found in your collection yet.",
  NO_SCROLLS_OF_TYPE: "No scrolls of this type yet. Ask your partner to add one!",
  NO_PARTNER_SCROLLS: "All scrolls are from you. Ask your partner to add some!",
  DATABASE_ERROR: "Unable to load scroll. Please try again.",
  UNKNOWN_ERROR: "Something went wrong. Please try again.",
};

function createResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function logError(context, error, details = {}) {
  console.error(`[fetch-random] ${context}:`, {
    message: error.message,
    code: error.code,
    stack: error.stack,
    ...details,
  });
}

function logInfo(context, message, details = {}) {
  console.info(`[fetch-random] ${context}: ${message}`, details);
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

    logInfo("DB", `Querying scrolls for couple: ${coupleId}`, { typeFilter, excludeSelf });

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

    if (scrolls.length === 0) {
      let message;
      if (excludeSelf && typeFilter) {
        message = ERROR_MESSAGES.NO_PARTNER_SCROLLS;
      } else if (typeFilter) {
        message = ERROR_MESSAGES.NO_SCROLLS_OF_TYPE;
      } else if (excludeSelf) {
        message = ERROR_MESSAGES.NO_PARTNER_SCROLLS;
      } else {
        message = ERROR_MESSAGES.NO_SCROLLS;
      }
      logInfo("QUERY", message);
      return createResponse({ error: message }, 404);
    }

    const randomIndex = Math.floor(Math.random() * scrolls.length);
    let randomScroll = scrolls[randomIndex];

    if (encryptionKey && randomScroll?.encryptedContent) {
      try {
        const content = decrypt(randomScroll.encryptedContent, encryptionKey);
        randomScroll = { ...randomScroll, content };
      } catch (err) {
        logError("DECRYPT", err, { scrollId: randomScroll.id });
        randomScroll = { ...randomScroll, content: "[Decryption failed]" };
      }
    } else if (!encryptionKey && randomScroll?.encryptedContent) {
      randomScroll = { ...randomScroll, content: "[Key not found - please re-login]" };
    }

    const duration = Date.now() - startTime;
    logInfo(
      "SUCCESS",
      `Selected random scroll ${randomIndex + 1}/${scrolls.length} in ${duration}ms`,
      { scrollId: randomScroll.id, type: randomScroll.type, excludeSelf }
    );

    return createResponse(
      {
        message: "A special scroll from your partner!",
        scroll: randomScroll,
        metadata: {
          totalScrolls: scrolls.length,
          selectedIndex: randomIndex,
          duration,
          fromPartner: randomScroll.userId !== userId,
        },
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

    if (error.stack?.includes("Firestore") || error.message?.includes("Firestore")) {
      logError("FIRESTORE", error, { typeFilter });
      return createResponse(
        { error: ERROR_MESSAGES.DATABASE_ERROR },
        500
      );
    }

    return createResponse({ error: ERROR_MESSAGES.UNKNOWN_ERROR }, 500);
  }
}