import { adminDb } from "@/lib/admin-firebase";
import { getCouple } from "@/lib/couple";
import { decrypt } from "@/lib/crypto";
import {
  verifyAuth,
  getUserData,
  createResponse,
  logError,
  logInfo,
  ERROR_MESSAGES,
} from "@/lib/api-utils";

/**
 * @swagger
 * /api/fetch-random:
 *   get:
 *     summary: Get a random scroll
 *     description: Retrieves a random scroll from the user's couple collection. Used for surprise/scroll-of-the-day feature.
 *     tags:
 *       - Scrolls
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter scrolls by type (e.g., "Moment", "Poem")
 *       - in: query
 *         name: excludeSelf
 *         schema:
 *           type: boolean
 *         description: Set to "true" to only return partner's scrolls
 *     responses:
 *       200:
 *         description: A random scroll
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 scroll:
 *                   $ref: '#/components/schemas/Scroll'
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     totalScrolls:
 *                       type: integer
 *                     selectedIndex:
 *                       type: integer
 *                     duration:
 *                       type: integer
 *                     fromPartner:
 *                       type: boolean
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No scrolls available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request) {
  const startTime = Date.now();

  const auth = await verifyAuth(request);
  if (auth.error) {
    logError("AUTH", new Error(auth.code), { reason: auth.error });
    return createResponse({ error: auth.error, code: auth.code }, auth.status);
  }

  const { userId } = auth;

  const userResult = await getUserData(userId);
  if (userResult.error) {
    logError("DB", new Error(userResult.code), { userId });
    return createResponse({ error: userResult.error, code: userResult.code }, userResult.status);
  }

  const { data: userData } = userResult;
  const coupleId = userData?.coupleId;

  if (!coupleId) {
    logError("AUTH", new Error("No couple ID"), { userId });
    return createResponse({ error: ERROR_MESSAGES.NO_COUPLE, code: "NO_COUPLE" }, 400);
  }

  const couple = await getCouple(coupleId);
  const encryptionKey = couple?.encryptionKey;

  const { searchParams } = new URL(request.url);
  const typeFilter = searchParams.get("type");
  const excludeSelf = searchParams.get("excludeSelf") === "true";

  logInfo("FETCH-RANDOM", `Querying scrolls for couple: ${coupleId}`, { typeFilter, excludeSelf });

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
    logInfo("FILTER", `${beforeCount - scrolls.length} own scrolls filtered, ${scrolls.length} partner scrolls remain`);
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
    return createResponse({ error: message, code: "NO_SCROLLS" }, 404);
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
  logInfo("SUCCESS", `Selected random scroll ${randomIndex + 1}/${scrolls.length} in ${duration}ms`, {
    scrollId: randomScroll.id,
    type: randomScroll.type,
    excludeSelf,
  });

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
}