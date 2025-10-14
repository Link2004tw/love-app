"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import ScrollCard from "../components/ui/ScrollCard";

export default function ScrollsPage() {
  const router = useRouter();
  const a = useAuth().displayName;
  const scrollTypes = [
    {
      type: "Moment",
      description: `Captured memories with a place and picture 📍📸`,
      path: "/scrolls/moment",
    },
    {
      type: "Lyric",
      description: `Song lyrics that sing to ${a} heart 🎵`,
      path: "/scrolls/lyrics",
    },
    {
      type: "Verse",
      description: `A Gifted sacred Bible verse from ${a}’s soul 📖`,
      path: "/scrolls/verse",
    },
    {
      type: "Poem",
      description: `Weaved words, poems from your darling ${a} ✍️`,
      path: "/scrolls/poem",
    },
    {
      type: "Words Of Affirmation",
      description: `${a} showers you with loving and uplifting words 💖`,
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
        <p>Crafted with endless love and devotion for my lovely Lili 💕</p>
      </footer>
    </div>
  );
}
