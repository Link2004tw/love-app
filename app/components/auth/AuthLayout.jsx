"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * AuthLayout - Provides consistent loading and redirect UI for auth-protected pages
 * 
 * @param {Object} props
 * @param {boolean} props.loading - Loading state from useAuth
 * @param {Object|null} props.user - Firebase user object
 * @param {string|null} props.coupleId - Couple ID for couple-protected pages
 * @param {string} [props.loadingText="Loading..."] - Custom loading text
 * @param {string} [props.redirectTo="/signin"] - Redirect destination when no user
 * @param {string} [props.redirectToWithCouple="/couple"] - Redirect when user has coupleId
 * @param {string} [props.redirectToWithoutCouple="/couple/create"] - Redirect when user lacks coupleId
 * @param {Function} props.children - Page content to render after auth checks
 */
export function AuthLayout({
  loading,
  user,
  coupleId,
  loadingText = "Loading...",
  redirectTo = "/signin",
  redirectToWithCouple = null,
  redirectToWithoutCouple = null,
  children,
}) {
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push(redirectTo);
      return;
    }

    if (coupleId !== null && coupleId !== undefined) {
      if (redirectToWithCouple) {
        router.push(redirectToWithCouple);
      }
    } else if (redirectToWithoutCouple) {
      router.push(redirectToWithoutCouple);
    }
  }, [loading, user, coupleId, router, redirectTo, redirectToWithCouple, redirectToWithoutCouple]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-pink-600">
          <div className="w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium">{loadingText}</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-pink-600">Redirecting...</div>
      </div>
    );
  }

  return children;
}

/**
 * AuthPage - Wrapper component for auth pages (signin/signup) that redirect logged-in users
 * 
 * @param {Object} props
 * @param {boolean} props.loading - Loading state from useAuth
 * @param {Object|null} props.user - Firebase user object
 * @param {Function} props.children - Page content
 */
export function AuthPage({ loading, user, children }) {
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/scrolls");
    }
  }, [loading, user, router]);

  if (loading || user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-pink-600">Loading...</div>
      </div>
    );
  }

  return children;
}