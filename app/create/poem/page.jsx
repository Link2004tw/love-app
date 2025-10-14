"use client";

import ScrollForm from "@/app/components/ui/ScrollFrom";
export default function PoemPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <main>
        <ScrollForm scrollType="Poem" />
      </main>
      <footer className="py-6 text-center text-sm text-gray-500">
        <p>
          Crafted with boundless love and poetic whispers for my lovely Lili 💕
        </p>
      </footer>
    </div>
  );
}
