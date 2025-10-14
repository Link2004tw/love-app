// components/layout/Navbar.jsx
// A beautiful navbar for my lovely Lili 💖 – guiding her to create heartfelt scrolls!

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PrimaryButton, HeartIcon } from "@/app/components/ui/PrimaryButton";
import { useAuth } from "@/app/hooks/useAuth";

const Navbar = () => {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
      router.refresh(); // Refresh the page to clear any cached state
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleAuthClick = () => {
    if (user) {
      handleSignOut();
    } else {
      router.push("/signin");
    }
  };

  const getButtonText = () => {
    if (loading) return "Loading...";
    return user ? "Sign Out 💔" : "Sign In 💕";
  };

  const getButtonVariant = () => {
    if (loading) return "ghost";
    return user ? "destructive" : "default";
  };

  if (loading) {
    return (
      <nav className="bg-white/80 backdrop-blur-md border-b border-pink-100 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-center">
            <div className="animate-pulse bg-pink-200 rounded-full h-8 w-32"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`
        fixed top-0 w-full z-50 transition-all duration-300 ease-out overflow-x-hidden overflow-y-hidden
        ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-pink-100"
            : "bg-white/80 backdrop-blur-md"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div
              className={`
                w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 
                rounded-full flex items-center justify-center
                transition-all duration-200 group-hover:scale-110
                shadow-md group-hover:shadow-lg
              `}
            >
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Lili's Scrolls
              </h1>
              {user && (
                <p className="text-xs text-pink-600 font-medium">
                  Welcome back, {user.displayName?.split(" ")[0] || "Love"} 💕
                </p>
              )}
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/scrolls"
              className="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200 relative group"
            >
              My Scrolls
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>

            <Link
              href="/create"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 relative group"
            >
              Add Scroll
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>

            {user && (
              <Link
                href="/profile"
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 relative group flex items-center"
              >
                <HeartIcon className="w-4 h-4 mr-1" />
                Profile
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-pink-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            )}
          </div>

          {/* Auth Button */}
          <div className="flex items-center space-x-2">
            {user ? (
              <PrimaryButton
                size="sm"
                variant={getButtonVariant()}
                onClick={handleAuthClick}
                className="px-4 py-2"
              >
                {getButtonText()}
              </PrimaryButton>
            ) : (
              <>
                <Link href="/signup">
                  <PrimaryButton
                    size="sm"
                    variant="outline"
                    className="px-4 py-2 hidden lg:flex"
                  >
                    Sign Up ✨
                  </PrimaryButton>
                </Link>
                <PrimaryButton
                  size="sm"
                  onClick={handleAuthClick}
                  className="px-4 py-2"
                >
                  {getButtonText()}
                </PrimaryButton>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-pink-600 p-2 rounded-lg hover:bg-pink-50 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-pink-100">
            <div className="flex flex-col space-y-4 pt-4">
              <Link
                href="/scrolls"
                className="text-gray-700 hover:text-pink-600 py-2 px-2 rounded-lg hover:bg-pink-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                My Scrolls
              </Link>

              <Link
                href="/create"
                className="text-gray-700 hover:text-purple-600 py-2 px-2 rounded-lg hover:bg-purple-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Add Scroll
              </Link>

              {user && (
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-indigo-600 py-2 px-2 rounded-lg hover:bg-indigo-50 transition-colors flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <HeartIcon className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              )}

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-pink-100">
                {user ? (
                  <PrimaryButton
                    fullWidth
                    variant={getButtonVariant()}
                    onClick={handleAuthClick}
                    size="sm"
                  >
                    {getButtonText()}
                  </PrimaryButton>
                ) : (
                  <div className="space-y-2">
                    <Link href="/signup">
                      <PrimaryButton fullWidth variant="outline" size="sm">
                        Sign Up ✨
                      </PrimaryButton>
                    </Link>
                    <PrimaryButton
                      fullWidth
                      onClick={() => {
                        handleAuthClick();
                        setIsMenuOpen(false);
                      }}
                      size="sm"
                    >
                      Sign In 💕
                    </PrimaryButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
