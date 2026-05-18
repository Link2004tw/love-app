// app/create/page.js
// Page to create new scrolls

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import {
  PrimaryButton,
  HeartIcon,
  StarIcon,
  SparkleIcon,
} from "@/app/components/ui/PrimaryButton";
import Link from "next/link";

export default function CreatePage() {
  const router = useRouter();
  const { user, loading: authLoading, coupleId } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signin");
    } else if (!authLoading && user && !coupleId) {
      router.push("/couple/create");
    }
  }, [authLoading, user, coupleId, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-pink-600">
          <div className="w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (!user || !coupleId) {
    return null;
  }

  // Scroll types and their descriptions
  const scrollTypes = [
    {
      type: "Moments",
      icon: HeartIcon,
      description:
        "Capture the little sparks of joy that make your heart flutter.",
      color: "from-pink-500 to-purple-600",
      actionText: "Create a Moment ✨",
      link: "/create/moment",
    },
    {
      type: "Poems",
      icon: StarIcon,
      description: "Weave words into poetry that dances like starlight.",
      color: "from-purple-500 to-indigo-600",
      actionText: "Write a Poem 🌟",
      link: "/create/poem",
    },
    {
      type: "Lyrics",
      icon: SparkleIcon,
      description: "Sing your soul's melody with heartfelt lyrics.",
      color: "from-indigo-500 to-pink-600",
      actionText: "Compose Lyrics 🎶",
      link: "/create/lyric",
    },
    {
      type: "Verses",
      icon: HeartIcon,
      description: "Craft sacred verses that echo your deepest emotions.",
      color: "from-pink-600 to-purple-500",
      actionText: "Share a Verse 💕",
      link: "/create/verse",
    },
    {
      type: "Words of Affirmation",
      icon: HeartIcon,
      description: "Tell your loved one how you feel about them.",
      color: "from-pink-400 to-purple-600",
      actionText: "Express your love 💕",
      link: "/create/words-of-affirmation",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Welcome, {user.displayName?.split(" ")[0] || "Love"}!
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your magical garden awaits – create, share, and cherish your
            beautiful scrolls. 💖
          </p>
        </div>

        {/* Scroll Type Cards */}
        <div className="flex flex-wrap justify-center gap-6">
          {scrollTypes.map((scroll) => (
            <div
              key={scroll.type}
              className="group bg-white rounded-xl shadow-lg border border-pink-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.5rem)] max-w-xs"
            >
              <div className="flex items-center justify-center mb-4">
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${scroll.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}
                >
                  <scroll.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 text-center mb-3">
                {scroll.type}
              </h2>
              <p className="text-gray-600 text-center text-sm mb-6">
                {scroll.description}
              </p>
              <Link href={scroll.link}>
                <PrimaryButton
                  fullWidth
                  size="md"
                  className={`bg-gradient-to-r ${scroll.color} rounded-lg group-hover:shadow-lg`}
                >
                  {scroll.actionText}
                </PrimaryButton>
              </Link>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 italic">
            "Every scroll you create is a piece of your heart, shared with your partner."
          </p>
        </div>
      </div>
    </div>
  );
}
