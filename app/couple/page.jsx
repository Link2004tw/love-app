"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AuthLayout } from "@/app/components/auth";
import { useAuth } from "@/app/hooks/useAuth";
import { PrimaryButton } from "@/app/components/ui/PrimaryButton";
import { getCoupleAction, getPartnerAction } from "@/app/actions/coupleAction";

export default function CouplePage() {
  const router = useRouter();
  const { user, loading, coupleId } = useAuth();
  const [couple, setCouple] = useState(null);
  const [partner, setPartner] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchCoupleData = async () => {
    if (!user) return;

    setFetching(true);
    try {
      const idToken = await user.getIdToken();

      const coupleResult = await getCoupleAction(idToken);
      if (coupleResult.error) {
        throw new Error(coupleResult.error);
      }
      setCouple(coupleResult.couple);

      const partnerResult = await getPartnerAction(idToken);
      if (partnerResult.success && partnerResult.partner) {
        setPartner(partnerResult.partner);
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!loading && user && coupleId) {
      fetchCoupleData();
    }
  }, [loading, user, coupleId]);

  const copyInviteCode = () => {
    if (couple?.inviteCode) {
      navigator.clipboard.writeText(couple.inviteCode);
      toast.success("Copied to clipboard!");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AuthLayout
      loading={loading}
      user={user}
      coupleId={coupleId}
      loadingText="Loading your couple..."
      redirectToWithoutCouple="/couple/create"
    >
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Your Couple
          </h1>

          {fetching ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {couple && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-pink-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      {couple.name}
                    </h2>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Invite Code</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-mono tracking-widest text-pink-600">
                          {couple.inviteCode}
                        </span>
                        <button
                          onClick={copyInviteCode}
                          className="text-pink-600 hover:text-pink-700"
                        >
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      Share this code with your partner to join
                    </p>
                  </div>

                  {partner && (
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-pink-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Your Partner
                      </h3>
                      <p className="text-gray-700">{partner.displayName}</p>
                      <p className="text-sm text-gray-500">{partner.email}</p>
                    </div>
                  )}

                  <div className="bg-white rounded-xl shadow-lg p-6 border border-pink-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <PrimaryButton
                        onClick={() => router.push("/scrolls")}
                        fullWidth
                      >
                        View Scrolls
                      </PrimaryButton>
                      <PrimaryButton
                        onClick={() => router.push("/create")}
                        variant="outline"
                        fullWidth
                      >
                        Create New Scroll
                      </PrimaryButton>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
