"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AuthLayout } from "@/app/components/auth";
import { useAuth } from "@/app/hooks/useAuth";
import { PrimaryButton } from "@/app/components/ui/PrimaryButton";

export default function CreateCouplePage() {
  const router = useRouter();
  const { user, loading, coupleId } = useAuth();
  const [coupleName, setCoupleName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const idToken = await user.getIdToken();
      const response = await fetch("/api/couple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ name: coupleName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create couple");
      }

      toast.success("Couple created successfully!");
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
      loadingText="Setting up your couple..."
      redirectToWithoutCouple={null}
    >
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Your Couple
            </h1>
            <p className="text-gray-600">
              Start sharing scrolls with your special someone
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-6">
            <div>
              <label
                htmlFor="coupleName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Couple Name
              </label>
              <input
                type="text"
                id="coupleName"
                value={coupleName}
                onChange={(e) => setCoupleName(e.target.value)}
                placeholder="e.g., Alex & Jordan"
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
                disabled={submitting}
              />
            </div>

            <PrimaryButton
              type="submit"
              size="lg"
              fullWidth
              disabled={submitting || !coupleName.trim()}
            >
              {submitting ? "Creating..." : "Create Couple"}
            </PrimaryButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have a couple?{" "}
              <button
                onClick={() => router.push("/couple/join")}
                className="font-semibold text-pink-600 hover:text-pink-700"
              >
                Join instead
              </button>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}