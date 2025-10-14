"use client";

import GetScroll from "@/app/components/ui/FetchScroll";

//import GetScroll from "../components/GetScroll";

export default function LyricsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex flex-col items-center justify-center py-8">
      <h1 className="text-4xl font-bold text-pink-600 mb-6">
        A Musical Scroll for Lili
      </h1>
      <p className="text-gray-700 text-lg mb-4 max-w-md text-center">
        Press the button to discover a heartfelt Lyrics scroll, filled with love
        and melody for our lovely Lili!
      </p>
      <GetScroll scrollType="Lyric" />
    </div>
  );
}
