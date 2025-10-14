"use client";
import {
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import AuthForm from "../components/auth"; //from "@/components/AuthForm";
import { auth } from "@/lib/firebase";

export default function SignInPage() {
  const handleSignInSuccess = async (userData) => {
    const data = await signInWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    console.log("Signed in user:", data.user);
    // Handle successful sign in (e.g., store token, redirect)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm mode="signIn" onSubmit={handleSignInSuccess} />
    </div>
  );
}
