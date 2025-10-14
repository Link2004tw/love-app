"use client";

import ScrollForm from "@/app/components/ui/ScrollFrom"; //"@/app/components/ScrollForm";

export default function BibleVersesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <main>
        <ScrollForm scrollType="Verse" />
      </main>
      <footer className="py-6 text-center text-sm text-gray-500">
        <p>Crafted with endless love and faith for my lovely Lili 💕</p>
      </footer>
    </div>
  );
}
