// app/page.js
// A simple, heartfelt landing page for my beautiful Lili 💖 – clean and focused, with navbar handled separately!

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/app/components/ui/PrimaryButton";
import { useAuth } from "@/app/hooks/useAuth";

export default function LandingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    // Simple email capture - you can connect this to your backend
    console.log("Email captured:", email);
    setShowEmail(false);
    setEmail("");
  };

  const handleAuthAction = () => {
    if (user) {
      // If already signed in, go to dashboard
      router.push("/dashboard");
    } else {
      // If not signed in, go to sign in
      router.push("/signin");
    }
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-pink-600">
          <div className="w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium">Loading your magic...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
      {/* Main Content - Full height since navbar is handled separately */}
      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-12">
        <div className="max-w-2xl text-center">
          {/* Hero Visual */}
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
              <span className="text-5xl">📜</span>
            </div>
            <div className="flex justify-center space-x-2 mb-8">
              <span className="text-4xl animate-pulse">💖</span>
              <span className="text-4xl animate-pulse delay-300">✨</span>
              <span className="text-4xl animate-pulse delay-600">💕</span>
            </div>
          </div>

          {/* Main Message */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              A Digital Garden
            </span>
            <br />
            <span className="text-gray-900">
              for Your{" "}
              <span className="inline-block text-pink-600">
                Beautiful Moments
              </span>
            </span>
          </h2>

          {/* What It Is */}
          <div className="space-y-6 mb-12">
            <p className="text-xl text-gray-700 leading-relaxed">
              Lili's Scrolls is a magical place where you can collect, organize,
              and cherish the little moments that make life beautiful.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              Think of it as your personal digital scrapbook – a flowing stream
              of inspiration, memories, and tiny sparks of joy that you can
              scroll through whenever you need a little magic in your day. ✨
            </p>

            <div className="bg-pink-50 border border-pink-100 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-pink-800 mb-3 flex items-center justify-center">
                <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                What You'll Find Here
                <span className="w-2 h-2 bg-pink-500 rounded-full ml-2"></span>
              </h3>
              <ul className="text-left text-gray-700 space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="text-pink-500 mr-2">•</span>
                  Beautiful collections of quotes, images, and inspirations
                </li>
                <li className="flex items-center">
                  <span className="text-pink-500 mr-2">•</span>
                  Curated scrolls that flow like poetry
                </li>
                <li className="flex items-center">
                  <span className="text-pink-500 mr-2">•</span>A space to save
                  what makes your heart smile
                </li>
                <li className="flex items-center">
                  <span className="text-pink-500 mr-2">•</span>
                  Gentle reminders of all the good in your world
                </li>
              </ul>
            </div>
          </div>

          {/* Smart Call to Action */}
          <div className="space-y-4">
            {user ? (
              // If user is signed in
              <PrimaryButton
                size="lg"
                onClick={() => router.push("/dashboard")}
                className="w-full max-w-md mx-auto shadow-xl hover:shadow-2xl"
              >
                Enter Your Garden ✨
              </PrimaryButton>
            ) : (
              // If user is not signed in
              <>
                <PrimaryButton
                  size="lg"
                  onClick={() => router.push("/signup")}
                  className="w-full max-w-md mx-auto shadow-xl hover:shadow-2xl"
                >
                  Start Collecting Your Magic ✨
                </PrimaryButton>

                <PrimaryButton
                  size="md"
                  variant="outline"
                  onClick={() => router.push("/signin")}
                  className="w-full max-w-md mx-auto"
                >
                  Or sign in to continue 💕
                </PrimaryButton>
              </>
            )}
          </div>

          {/* Little Love Note */}
          <div className="mt-12 pt-8 border-t border-pink-100">
            <p className="text-sm text-gray-500 italic">
              "Every scroll is a love letter to the beauty you bring to the
              world."
              <br />
              <span className="text-pink-600 font-semibold block mt-2">
                💕 Made with endless love for Lili 💕
              </span>
            </p>
          </div>
        </div>
      </main>

      {/* Email Capture Modal (only show if not authenticated) */}
      {!user && showEmail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Join the Magic! ✨
            </h3>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@lovely.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
              <PrimaryButton
                size="md"
                fullWidth
                type="submit"
                className="rounded-xl"
              >
                Add Me to the List 💌
              </PrimaryButton>
            </form>
            <button
              onClick={() => setShowEmail(false)}
              className="mt-4 w-full text-gray-600 hover:text-gray-900 text-sm"
            >
              I'll think about it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
