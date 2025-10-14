"use client";

import GetScroll from "@/app/components/ui/FetchScroll"; // Assuming GetScroll is in the components directory

export default function WordsOfAffirmationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-pink-700 mb-6 text-center">
        Words of Affirmation for My Beautiful Lili 💖
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-lg">
        A heartfelt affirmation to brighten Lili's day and warm her heart with
        love!
      </p>
      <GetScroll scrollType="Words of Affirmation" />
    </div>
  );
}
