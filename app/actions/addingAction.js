"use server";

import { adminAuth, adminDb } from "@/lib/admin-firebase";
import Scroll from "@/models/scroll";
import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function addScroll(formData) {
  const idToken = formData.get("idToken");
  const type = formData.get("type");
  const content = formData.get("content"); // Preserve newlines (\n) in content as received
  const location = formData.get("location");
  const image = formData.get("image");
  const songUrl = formData.get("songUrl");
  const verseUrl = formData.get("verseUrl");
  const mapUrl = formData.get("mapUrl"); // New mapUrl for Moment

  // Validate required fields
  if (!idToken) {
    return { error: "Unauthorized: No token provided" };
  }

  if (!type || !content) {
    return { error: "Missing required fields: type and content are required" };
  }

  try {
    // Verify user access (no admin required)
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    if (!decodedToken.uid) {
      return { error: "Unauthorized: Invalid token" };
    }

    let imageUrl = null;

    // Upload image to Cloudinary if provided (for Moments)
    if (image && image.size > 0) {
      const fileBuffer = Buffer.from(await image.arrayBuffer());
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: `scrolls/${decodedToken.uid}`, // Store in scrolls/userId
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

    // Create Scroll instance, ensuring content preserves newlines
    const scroll = new Scroll({
      type,
      content, // Store content as-is to preserve \n
      createdAt: new Date().toISOString(),
      username: decodedToken.name || "Anonymous",
      imageUrl,
      location: location || null,
      songUrl: type === "Lyric" ? songUrl || null : null,
      verseUrl:
        type === "Verse"
          ? verseUrl ||
            "https://www.biblegateway.com/passage/?search=1%20Corinthians%202%3A14&version=NIV"
          : null,
      mapUrl: type === "Moment" ? mapUrl || null : null, // mapUrl for Moment
      userId: decodedToken.uid, // For Firestore security rules
      id: null, // ID will be set by Firestore
    });
    // In addingAction.js, around line 84
    const scrollData = scroll.toJSON();
    const docRef = await adminDb.collection("love-scrolls").add(scrollData);

    return { ...scroll.toJSON(), id: docRef.id };
  } catch (error) {
    console.error("Error adding scroll:", error);
    return { error: "Failed to add scroll: " + error.message };
  }
}

/* Note: If newlines (\n) are not displaying correctly in poems, ensure the client-side rendering (e.g., in GetScroll.jsx) 
   uses CSS white-space: pre-line or a <pre> tag to respect newlines in the content. For example:
   <p className="text-gray-700 mt-2 whitespace-pre-line">{scroll.content}</p>
*/
