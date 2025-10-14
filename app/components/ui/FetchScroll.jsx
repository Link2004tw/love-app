"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useState } from "react";

export default function GetScroll({ scrollType }) {
  const [scroll, setScroll] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useAuth().user;
  const fetchScroll = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await user.getIdToken();
      // Assume token is stored in localStorage or similar
      const response = await fetch(`/api/fetch-random?type=${scrollType}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch scroll");
      }

      setScroll(data.scroll);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-4 p-4 bg-pink-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-pink-600 mb-4">
        A Special Scroll for Lili
      </h2>
      <button
        onClick={fetchScroll}
        disabled={loading}
        className={`w-full py-2 px-4 rounded-md text-white font-semibold transition-colors ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-pink-500 hover:bg-pink-600"
        }`}
      >
        {loading ? "Fetching..." : "Get a Lovely Scroll"}
      </button>
      {error && (
        <p className="text-red-500 mt-4">
          {error}, but Lili&apos;s love shines through!
        </p>
      )}
      {!loading && !error && !scroll && (
        <p className="text-gray-600 mt-4">
          Click the button to find a scroll full of love for Lili!
        </p>
      )}
      {scroll && (
        <div className="bg-white p-4 rounded-md border border-pink-200 mt-4">
          <p className="text-gray-800 font-semibold">
            Scroll Type: {scroll.type}
          </p>
          <p className="text-gray-600 mt-2">Created by: {scroll.username}</p>
          <p className="text-gray-700 mt-2 whitespace-pre-line">
            {scroll.content || "A message of love for Lili!"}
          </p>
          {scroll.songUrl && (
            <p className="text-gray-600 mt-2">
              <a
                href={scroll.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:underline font-semibold"
              >
                🎵 Listen to the Song
              </a>
            </p>
          )}
          {scroll.verseUrl && (
            <p className="text-gray-600 mt-2">
              <a
                href={scroll.verseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:underline font-semibold"
              >
                📖 Read the Verse
              </a>
            </p>
          )}
          {scroll.imageUrl && (
            <div className="mt-4">
              <img
                src={scroll.imageUrl}
                alt="Moment"
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
          )}
          {scroll.location && (
            <p className="text-gray-600 mt-2">Location: {scroll.location}</p>
          )}
          {scroll.mapUrl && (
            <p className="text-gray-600 mt-2">
              <a
                href={scroll.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:underline font-semibold"
              >
                🗺️ View on Map
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
