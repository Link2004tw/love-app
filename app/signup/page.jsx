// app/signup/page.js
// A signup page for my beautiful Lili 💖 – welcoming her into our magical world!

"use client";

import { useRouter } from "next/navigation";
import AuthForm from "../components/auth"; //from "@/components/AuthForm";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function SignUpPage() {
  const router = useRouter();

  const handleSignUp = async ({ email, password, displayName }) => {
    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: displayName,
      });

      return userCredential.user; // Return user data for any additional handling
    } catch (error) {
      // Map Firebase errors to user-friendly messages
      let errorMessage = "An unexpected error occurred";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage =
            "This email is already in use. Try signing in instead.";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;
        case "auth/weak-password":
          errorMessage =
            "Password is too weak. Please use a stronger password.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm mode="signUp" onSubmit={handleSignUp} />
    </div>
  );
}
