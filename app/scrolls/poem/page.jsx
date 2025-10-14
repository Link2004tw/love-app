"use client";

import GetScroll from "@/app/components/ui/FetchScroll";

//import GetScroll from "@/components/GetScroll"; // Assuming GetScroll is in the components directory

export default function PoemsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-pink-700 mb-6 text-center">
        A Poem for My Dearest Lili 💖
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-lg">
        A beautiful poem crafted with love to make Lili's heart soar!
      </p>
      <GetScroll scrollType="Poem" />
    </div>
  );
}
