import { adminAuth } from "@/lib/admin-firebase";
import { joinCouple } from "@/lib/couple";
import { updateUserCoupleId } from "../../../actions/userAction";

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
    const { inviteCode } = body;

    if (!inviteCode) {
      return new Response(JSON.stringify({ error: "Invite code is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await joinCouple(inviteCode, userId);

    if (result.error) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await updateUserCoupleId(userId, result.id);

    return new Response(
      JSON.stringify({
        message: "Successfully joined couple",
        couple: { id: result.id, name: result.name },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error joining couple:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}