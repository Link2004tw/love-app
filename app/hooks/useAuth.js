"use client";

import { useState, useEffect, useCallback } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

/**
 * useAuth - Custom hook for Firebase Authentication state management
 * 
 * Features:
 * - Manages user authentication state
 * - Fetches user profile data including coupleId via Admin SDK
 * - Provides signOut functionality
 * - Handles loading states and error management
 * 
 * @returns {Object} Auth state and methods
 * @returns {Object|null} user - Firebase user object
 * @returns {boolean} loading - Auth loading state
 * @returns {string|null} error - Error message if any
 * @returns {boolean} isAuthenticated - True if user is logged in and loaded
 * @returns {Function} signOut - Async function to sign out user
 * @returns {string|null} displayName - User's display name
 * @returns {string|null} email - User's email
 * @returns {string|null} uid - User's unique ID
 * @returns {string|null} coupleId - Couple ID if user is part of a couple
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coupleId, setCoupleId] = useState(null);

  const fetchUserData = useCallback(async (uid) => {
    try {
      const { getUserWithAuth } = await import("../actions/userAction");
      const userData = await getUserWithAuth(uid);
      if (userData) {
        setCoupleId(userData.coupleId || null);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!isActive) return;

        if (firebaseUser) {
          setUser(firebaseUser);
          await fetchUserData(firebaseUser.uid);
        } else {
          setUser(null);
          setCoupleId(null);
        }

        if (isActive) {
          setLoading(false);
        }
      },
      (err) => {
        if (isActive) {
          console.error("Auth state error:", err);
          setError(err.message);
          setLoading(false);
        }
      }
    );

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [fetchUserData]);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setCoupleId(null);
    } catch (error) {
      console.error("Sign out error:", error);
      setError(error.message);
      throw error;
    }
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user && !loading,
    signOut,
    displayName: user?.displayName,
    email: user?.email,
    uid: user?.uid,
    coupleId,
  };
};