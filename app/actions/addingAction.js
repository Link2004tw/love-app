"use server";

import { adminAuth, adminDb } from "@/lib/admin-firebase";
import Scroll from "@/models/scroll";
import { v2 as cloudinary } from "cloudinary";
import { getCouple } from "@/lib/couple";
import { encrypt } from "@/lib/crypto";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function addScroll(formData) {
  const idToken = formData.get("idToken");
  const type = formData.get("type");
  const content = formData.get("content");
  const location = formData.get("location");
  const image = formData.get("image");
  const songUrl = formData.get("songUrl");
  const verseUrl = formData.get("verseUrl");
  const mapUrl = formData.get("mapUrl");

  if (!idToken) {
    return { error: "Unauthorized: No token provided" };
  }

  if (!type || !content) {
    return { error: "Missing required fields: type and content are required" };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    if (!userId) {
      return { error: "Unauthorized: Invalid token" };
    }

    const userDoc = await adminDb.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return { error: "User profile not found. Please sign in again." };
    }

    const userData = userDoc.data();
    const coupleId = userData?.coupleId;

    if (!coupleId) {
      return { error: "You need to join a couple before creating scrolls" };
    }

    const couple = await getCouple(coupleId);
    if (!couple) {
      return { error: "Couple not found" };
    }

    let encryptionKey = couple.encryptionKey;
    if (!encryptionKey) {
      const { generateKey } = await import("@/lib/crypto");
      encryptionKey = generateKey();
      await adminDb.collection("couples").doc(coupleId).update({ encryptionKey });
    }

    const encryptedContent = encrypt(content, encryptionKey);

    const displayName = userData.displayName || decodedToken.name || "Anonymous";

    let imageUrl = null;

    if (image && image.size > 0) {
      const fileBuffer = Buffer.from(await image.arrayBuffer());
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: `scrolls/${coupleId}`,
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(fileBuffer);
      });
      imageUrl = uploadResult.secure_url;
    }

    const scroll = new Scroll({
      type,
      encryptedContent,
      createdAt: new Date().toISOString(),
      username: displayName,
      imageUrl,
      location: location || null,
      songUrl: type === "Lyric" ? songUrl || null : null,
      verseUrl:
        type === "Verse"
          ? verseUrl ||
            "https://www.biblegateway.com/passage/?search=1%20Corinthians%202%3A14&version=NIV"
          : null,
      mapUrl: type === "Moment" ? mapUrl || null : null,
      userId,
      coupleId,
      id: null,
    });

    const scrollData = scroll.toJSON();
    const docRef = await adminDb.collection("love-scrolls").add(scrollData);

    return { ...scroll.toJSON(), id: docRef.id };
  } catch (error) {
    console.error("Error adding scroll:", error);
    return { error: "Failed to add scroll: " + error.message };
  }
}