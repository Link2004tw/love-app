"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AuthLayout } from "@/app/components/auth";
import { useAuth } from "@/app/hooks/useAuth";
import { PrimaryButton } from "@/app/components/ui/PrimaryButton";

export default function JoinCouplePage() {
  const router = useRouter();
  const { user, loading, coupleId } = useAuth();
  const [inviteCode, setInviteCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const idToken = await user.getIdToken();
      const response = await fetch("/api/couple/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ inviteCode: inviteCode.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to join couple");
      }

      toast.success("Successfully joined couple!");
      router.push("/couple");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      loading={loading}
      user={user}
      coupleId={coupleId}
      loadingText="Joining couple..."
      redirectToWithoutCouple={null}
    >
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join a Couple
            </h1>
            <p className="text-gray-600">
              Enter the invite code from your partner
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label
                htmlFor="inviteCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Invite Code
              </label>
              <input
                type="text"
                id="inviteCode"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-character code"
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-center text-xl tracking-widest uppercase"
                required
                disabled={submitting}
                maxLength={6}
              />
            </div>

            <PrimaryButton
              type="submit"
              size="lg"
              fullWidth
              disabled={submitting || inviteCode.length !== 6}
            >
              {submitting ? "Joining..." : "Join Couple"}
            </PrimaryButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have a code?{" "}
              <button
                onClick={() => router.push("/couple/create")}
                className="font-semibold text-pink-600 hover:text-pink-700"
              >
                Create a couple
              </button>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}