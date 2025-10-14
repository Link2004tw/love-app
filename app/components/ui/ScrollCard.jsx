"use client";

import { useRouter } from "next/navigation";
export default function ScrollCard({ scroll }) {
  const router = useRouter();
  return (
    <button
      key={scroll.type}
      onClick={() => router.push(scroll.path)}
      className="bg-white rounded-xl shadow-lg border border-pink-100 p-6 text-left hover:bg-pink-50 hover:shadow-xl transition-all duration-200"
    >
      <h2 className="text-xl font-semibold text-gray-900">{scroll.type} 💕</h2>
      <p className="mt-2 text-gray-600 text-sm">{scroll.description}</p>
    </button>
  );
}
