"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import ScrollCard from "../components/ui/ScrollCard";

export default function ScrollsPage() {
  const router = useRouter();
  const { user, loading: authLoading, coupleId } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-50 flex items-center justify-center">
        <div className="text-pink-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    router.push("/signin");
    return null;
  }

  if (!coupleId) {
    router.push("/couple/create");
    return null;
  }

  const scrollTypes = [
    {
      type: "Moment",
      description: `Captured memories with a place and picture 📍📸`,
      path: "/scrolls/moment",
    },
    {
      type: "Lyric",
      description: `Song lyrics that speak to your heart 🎵`,
      path: "/scrolls/lyrics",
    },
    {
      type: "Verse",
      description: `A sacred Bible verse from your soul 📖`,
      path: "/scrolls/verse",
    },
    {
      type: "Poem",
      description: `Weaved words and poems from your heart ✍️`,
      path: "/scrolls/poem",
    },
    {
      type: "Words Of Affirmation",
      description: `Loving and uplifting words for your partner 💖`,
      path: "/scrolls/affirmation",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 pt-40">
      <main className="max-w-4xl mx-auto px-4 py-16 justify-self-center align-center">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
          Open a lovely scroll 💌
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {scrollTypes.map((scroll) => (
            <ScrollCard key={scroll.type} scroll={scroll} />
          ))}
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-gray-500">
        <p>Crafted with love for our special couple</p>
      </footer>
    </div>
  );
}
