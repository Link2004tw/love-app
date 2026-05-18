"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AuthPage, AuthForm } from "@/app/components/auth";
import { useAuth } from "@/app/hooks/useAuth";
import { getAuthErrorMessage } from "@/lib/authErrors";

export default function SignInPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleSignIn = async ({ email, password }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back! Signed in successfully");
    } catch (error) {
      const errorMessage = error.code
        ? getAuthErrorMessage(error.code)
        : error.message || "Sign in failed. Please try again";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthPage loading={loading} user={user}>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <AuthForm mode="signIn" onSubmit={handleSignIn} />
      </div>
    </AuthPage>
  );
}