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
 * /api/fetch-scrolls:
 *   get:
 *     summary: Get all scrolls for a couple
 *     description: Retrieves all scrolls for the authenticated user's couple, with optional filtering by type and excluding own scrolls.
 *     tags:
 *       - Scrolls
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter scrolls by type (e.g., "Moment", "Poem", "Lyric", "Verse", "WordsOfAffirmation")
 *       - in: query
 *         name: excludeSelf
 *         schema:
 *           type: boolean
 *         description: Set to "true" to exclude scrolls created by the current user
 *     responses:
 *       200:
 *         description: List of scrolls
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 scrolls:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Scroll'
 *                 count:
 *                   type: integer
 *                 duration:
 *                   type: integer
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Bad request - No couple found
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

  logInfo("FETCH-SCROLLS", `Fetching scrolls for couple: ${coupleId}`, { typeFilter, excludeSelf });

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
  logInfo("SUCCESS", `Fetched ${scrolls.length} scrolls in ${duration}ms`, { coupleId, typeFilter, excludeSelf });

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
}