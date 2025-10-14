"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { PrimaryButton } from "@/app/components/ui/PrimaryButton";
import { addScroll } from "@/app/actions/addingAction";

export default function ScrollForm({ scrollType }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const [songUrl, setSongUrl] = useState("");
  const [verseUrl, setVerseUrl] = useState("");
  const [mapUrl, setMapUrl] = useState(""); // New state for mapUrl
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-pink-600">
          <div className="w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium">
            Loading your {scrollType.toLowerCase()} creation...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/signin");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Get Firebase ID token
      const idToken = await user.getIdToken();

      // Create formData for server action
      const formData = new FormData();
      formData.append("idToken", idToken);
      formData.append("type", scrollType);
      formData.append("content", content);
      if (location) formData.append("location", location);
      if (image) formData.append("image", image);
      if (songUrl) formData.append("songUrl", songUrl);
      if (verseUrl) formData.append("verseUrl", verseUrl);
      if (mapUrl) formData.append("mapUrl", mapUrl); // Add mapUrl

      // Call server action
      const result = await addScroll(formData);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(`Your ${scrollType.toLowerCase()} was saved! 💕`);
        setContent("");
        setImage(null);
        setLocation("");
        setSongUrl("");
        setVerseUrl("");
        setMapUrl(""); // Reset mapUrl
        setTimeout(() => router.push("/create"), 1000); // Redirect after success
      }
    } catch (err) {
      console.error(`Error creating ${scrollType.toLowerCase()}:`, err);
      setError(
        err.message || `Failed to create your ${scrollType.toLowerCase()}.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 pt-24 pb-12 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-pink-100 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Create a {scrollType} 💖
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Pour your heart into a beautiful {scrollType.toLowerCase()}.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your {scrollType} ✨
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              placeholder={`Write your ${scrollType.toLowerCase()} here...`}
              rows={4}
              required
              disabled={loading}
            />
          </div>

          {scrollType === "Moment" && (
            <>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Where Did This Happen? (Optional) 📍
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Central Park or Our Cozy Café"
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Add an Image (Optional) 📸
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full text-black text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100"
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  htmlFor="mapUrl"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Map Link (Optional) 🗺️
                </label>
                <input
                  type="url"
                  id="mapUrl"
                  value={mapUrl}
                  onChange={(e) => setMapUrl(e.target.value)}
                  className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., https://www.google.com/maps?q=Central+Park"
                  disabled={loading}
                />
              </div>
            </>
          )}

          {scrollType === "Lyric" && (
            <div>
              <label
                htmlFor="songUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Song Link (Optional) 🎵
              </label>
              <input
                type="url"
                id="songUrl"
                value={songUrl}
                onChange={(e) => setSongUrl(e.target.value)}
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Spotify or YouTube link"
                disabled={loading}
              />
            </div>
          )}

          {scrollType === "Verse" && (
            <div>
              <label
                htmlFor="verseUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Bible Verse Link (Optional) 📖
              </label>
              <input
                type="url"
                id="verseUrl"
                value={verseUrl}
                onChange={(e) => setVerseUrl(e.target.value)}
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., https://www.biblegateway.com/passage/?search=John%203%3A16&version=NIV"
                disabled={loading}
              />
            </div>
          )}

          <PrimaryButton
            type="submit"
            fullWidth
            size="lg"
            disabled={loading || !content}
            className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              `Save ${scrollType} 💕`
            )}
          </PrimaryButton>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 italic">
            "Every {scrollType.toLowerCase()} is a piece of your heart."
            <br />
            <span className="text-pink-600 font-semibold">
              💕 Made with endless love for Lili 💕
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
