import { adminAuth, adminDb } from "@/lib/admin-firebase";

export async function GET(request) {
  // Extract Authorization header
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: Missing or invalid token" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  //console.log("test");
  const token = authHeader.split("Bearer ")[1];

  try {
    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid; // User is signed in, we have their UID
    const userRecord = await adminAuth.getUser(userId);

    // Get the 'type' query parameter
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    if (!type) {
      return new Response(
        JSON.stringify({ error: "Missing required query parameter: type" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    console.log(`Fetching a random scroll of type: ${type}`);
    console.log(`Excluding scrolls from user: ${userRecord.displayName}`);

    // Fetch scrolls from Firestore for the specified type, excluding the authenticated user's scrolls
    const scrollsRef = adminDb.collection("love-scrolls");
    const querySnapshot = await scrollsRef
      .where("type", "==", type)
      .where("username", "!=", userRecord.displayName)
      .get();

    if (querySnapshot.empty) {
      return new Response(
        JSON.stringify({
          error: `No scrolls of type '${type}' found from other users, but Lili's love is boundless!`,
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Collect scrolls and select a random one
    const scrolls = [];
    querySnapshot.forEach((doc) => {
      scrolls.push({ id: doc.id, ...doc.data() });
    });
    const randomScroll = scrolls[Math.floor(Math.random() * scrolls.length)];

    return new Response(
      JSON.stringify({
        message: `A special '${type}' scroll from another user, chosen with love for Lili!`,
        scroll: randomScroll,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error verifying token or fetching data:", error);
    if (
      error.code === "auth/argument-error" ||
      error.code === "auth/invalid-credential"
    ) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid token" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    return new Response(
      JSON.stringify({
        error: "Internal server error, but Lili's love shines through!",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
