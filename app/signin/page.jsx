import AuthForm from "../components/auth"; //from "@/components/AuthForm";

export default function SignInPage() {
  const handleSignInSuccess = async (userData) => {
    // Handle successful sign in (e.g., store token, redirect)
    console.log("Signed in successfully:", userData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm mode="signIn" onSuccess={handleSignInSuccess} />
    </div>
  );
}
