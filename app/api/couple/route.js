import { adminAuth, adminDb } from "@/lib/admin-firebase";
import { createCouple, getCouple, updateCoupleName } from "@/lib/couple";
import { updateUserCoupleId } from "@/app/actions/userAction";

export async function POST(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return new Response(JSON.stringify({ error: "Couple name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const couple = await createCouple(name, userId);

    await updateUserCoupleId(userId, couple.id);

    return new Response(
      JSON.stringify({
        message: "Couple created successfully",
        couple: { id: couple.id, name, inviteCode: couple.inviteCode },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating couple:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const userDoc = await adminDb.collection("users").doc(userId).get();
    const userData = userDoc.data();

    if (!userData || !userData.coupleId) {
      return new Response(
        JSON.stringify({ error: "No couple found", hasCouple: false }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const couple = await getCouple(userData.coupleId);
    if (!couple) {
      return new Response(JSON.stringify({ error: "Couple not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        couple,
        hasCouple: true,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error getting couple:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}