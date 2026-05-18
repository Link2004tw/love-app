"use client";

import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "@/lib/firebase";
import { AuthPage, AuthForm } from "@/app/components/auth";
import { useAuth } from "@/app/hooks/useAuth";
import { createUserDocument } from "@/app/actions/userAction";
import { getAuthErrorMessage } from "@/lib/authErrors";

export default function SignUpPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleSignUp = async ({ email, password, displayName }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: displayName,
      });

      await createUserDocument(
        userCredential.user.uid,
        email,
        displayName
      );

      toast.success("Welcome! Account created successfully");
    } catch (error) {
      const errorMessage = error.code
        ? getAuthErrorMessage(error.code)
        : error.message || "Sign up failed. Please try again";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthPage loading={loading} user={user}>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <AuthForm mode="signUp" onSubmit={handleSignUp} />
      </div>
    </AuthPage>
  );
}