"use client";

import GetScroll from "@/app/components/ui/FetchScroll";

export default function VersePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-pink-700 mb-6 text-center">
        A Bible Verse for My Lovely Lili 💖
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-lg">
        Discover a special Bible verse chosen just for you, Lili, to fill your
        heart with love and inspiration!
      </p>
      <GetScroll scrollType="Verse" />
    </div>
  );
}
