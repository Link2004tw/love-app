"use client";

import GetScroll from "@/app/components/ui/FetchScroll";

export default function MomentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-pink-700 mb-6 text-center">
        A Special Moment for My Lovely Lili 💖
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-lg">
        Relive a cherished moment crafted with love just for you, Lili!
      </p>
      <GetScroll scrollType="Moment" />
    </div>
  );
}
