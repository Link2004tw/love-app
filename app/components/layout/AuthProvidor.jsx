// components/layout/AuthProvider.jsx
// A gentle wrapper to keep Lili's auth state flowing smoothly 💖

"use client";

import { useAuth } from "@/app/hooks/useAuth";

const AuthProvider = ({ children }) => {
  const { loading } = useAuth();

  // You can add more global auth state here if needed later
  return (
    <>
      {children}
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex items-center space-x-2 text-pink-600">
            <div className="w-6 h-6 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading your magic...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthProvider;
