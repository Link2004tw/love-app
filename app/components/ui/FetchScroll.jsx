"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/app/hooks/useAuth";

const ERROR_MESSAGES = {
  NOT_AUTHENTICATED: "Please sign in to view scrolls",
  NETWORK_ERROR: "Network error. Please check your connection",
  SERVER_ERROR: "Server error. Please try again later",
  NO_SCROLLS_TYPE: "No scrolls of this type from your partner yet",
  NO_SCROLLS: "No scrolls in your collection yet",
  NOT_PART_OF_COUPLE: "You need to join a couple first",
  ALL_FROM_YOURSELF: "You created all scrolls of this type. Ask your partner to add some!",
};

const ScrollContent = ({ scroll }) => (
  <div className="bg-white p-4 rounded-md border border-pink-200 mt-4">
    <p className="text-gray-800 font-semibold">Scroll Type: {scroll.type}</p>
    <p className="text-gray-600 mt-2">Created by: {scroll.username}</p>
    <p className="text-gray-700 mt-2 whitespace-pre-line">
      {scroll.content || "A message of love!"}
    </p>

    {scroll.createdAt && (
      <p className="text-gray-400 text-sm mt-2">
        {new Date(scroll.createdAt).toLocaleDateString()}
      </p>
    )}

    {scroll.songUrl && (
      <p className="text-gray-600 mt-2">
        <a
          href={scroll.songUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-500 hover:underline font-semibold"
        >
          Listen to the Song
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
          Read the Verse
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
          View on Map
        </a>
      </p>
    )}
  </div>
);

export default function GetScroll({ scrollType }) {
  const { user, loading: authLoading, coupleId } = useAuth();
  const [scroll, setScroll] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchScroll = useCallback(async () => {
    if (!user) {
      toast.error(ERROR_MESSAGES.NOT_AUTHENTICATED);
      setError(ERROR_MESSAGES.NOT_AUTHENTICATED);
      return;
    }

    if (!coupleId) {
      toast.error(ERROR_MESSAGES.NOT_PART_OF_COUPLE);
      setError(ERROR_MESSAGES.NOT_PART_OF_COUPLE);
      return;
    }

    setLoading(true);
    setError(null);
    setScroll(null);

    try {
      const token = await user.getIdToken();
      const encodedType = encodeURIComponent(scrollType);
      const response = await fetch(
        `/api/fetch-scrolls?type=${encodedType}&excludeSelf=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(`[GetScroll] API Error (${response.status}):`, data);
        const errorMessage = data.error || ERROR_MESSAGES.SERVER_ERROR;
        toast.error(errorMessage);
        setError(errorMessage);
        return;
      }

      if (data.empty || !data.scrolls || data.scrolls.length === 0) {
        const emptyMessage = ERROR_MESSAGES.NO_SCROLLS_TYPE;
        toast(emptyMessage);
        setError(emptyMessage);
        return;
      }

      const randomIndex = Math.floor(Math.random() * data.scrolls.length);
      const randomScroll = data.scrolls[randomIndex];
      setScroll(randomScroll);
      toast.success("Found a scroll from your partner!");
    } catch (err) {
      console.error("[GetScroll] Fetch error:", err);
      const errorMessage =
        err.message === "Failed to fetch"
          ? ERROR_MESSAGES.NETWORK_ERROR
          : ERROR_MESSAGES.SERVER_ERROR;
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, coupleId, scrollType]);

  if (authLoading) {
    return (
      <div className="max-w-md mx-auto my-4 p-4 bg-pink-50 rounded-lg shadow-md">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-pink-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-4 p-4 bg-pink-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-pink-600 mb-4">
        A Special Scroll from Your Partner
      </h2>

      <button
        onClick={fetchScroll}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-all duration-200 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-pink-500 hover:bg-pink-600 active:bg-pink-700"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Finding a scroll...
          </span>
        ) : (
          "Get a Scroll from Your Partner"
        )}
      </button>

      {error && !loading && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm text-center">{error}</p>
        </div>
      )}

      {!loading && !error && !scroll && (
        <p className="text-gray-600 mt-4 text-center">
          Click the button to discover a scroll from your partner!
        </p>
      )}

      {scroll && <ScrollContent scroll={scroll} />}
    </div>
  );
}