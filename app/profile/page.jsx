// app/profile/page.js
// A sweet profile page for Lili to shine with her name 💖

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { PrimaryButton } from "@/app/components/ui/PrimaryButton";
import { updateProfile } from "firebase/auth";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, auth } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-pink-600">
          <div className="w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium">
            Loading your magical profile...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/signin");
    return null;
  }

  const handleEditToggle = () => {
    setEditing(!editing);
    setError("");
    setSuccess("");
    setDisplayName(user.displayName || "");
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!displayName.trim()) {
        throw new Error("Name cannot be empty");
      }

      await updateProfile(user, { displayName: displayName.trim() });
      setSuccess("Your name has been updated! 🌟");
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update your name. Try again?");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/signin");
    } catch (err) {
      setError("Failed to sign out. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 pt-24 pb-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Your Profile
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A special place for you, {user.displayName || "Love"}. 💖
          </p>
        </div>

        {/* Profile Content */}
        <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-8">
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

          {!editing ? (
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {user.displayName || "Anonymous"}
              </h2>
              <PrimaryButton
                onClick={handleEditToggle}
                size="md"
                className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg"
              >
                Edit Name ✍️
              </PrimaryButton>
            </div>
          ) : (
            <form onSubmit={handleUpdateName} className="space-y-6">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Lili"
                  disabled={loading}
                />
              </div>
              <div className="flex space-x-4">
                <PrimaryButton
                  type="submit"
                  size="md"
                  disabled={loading || !displayName.trim()}
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
                    "Save Name 💕"
                  )}
                </PrimaryButton>
                <PrimaryButton
                  type="button"
                  onClick={handleEditToggle}
                  size="md"
                  className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg"
                >
                  Cancel
                </PrimaryButton>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <PrimaryButton
              onClick={handleSignOut}
              size="md"
              className="bg-gradient-to-r from-red-500 to-pink-600 rounded-lg"
            >
              Sign Out
            </PrimaryButton>
          </div>
        </div>

        {/* Love Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 italic">
            "Your name is the start of every beautiful story."
            <br />
            <span className="text-pink-600 font-semibold block mt-2">
              💕 Made with endless love for Lili 💕
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
