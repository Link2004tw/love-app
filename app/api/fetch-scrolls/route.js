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

  const token = authHeader.split("Bearer ")[1];

  try {
    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid; // User is signed in, we have their UID

    // Get the 'targetUserId' query parameter
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get("targetUserId");
    if (!targetUserId) {
      return new Response(
        JSON.stringify({
          error: "Missing required query parameter: targetUserId",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Fetch scrolls from Firestore for the target user
    const scrollsRef = adminDb.collection("scrolls");
    const querySnapshot = await scrollsRef
      .where("userId", "==", targetUserId)
      .get();

    const scrolls = [];
    querySnapshot.forEach((doc) => {
      scrolls.push({ id: doc.id, ...doc.data() });
    });

    return new Response(
      JSON.stringify({
        message: `Sending love to Lili with these special scrolls!`,
        scrolls,
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
