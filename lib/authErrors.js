export const AUTH_ERROR_MESSAGES = {
  "auth/user-not-found": "No account found with this email",
  "auth/wrong-password": "Incorrect password",
  "auth/invalid-credential": "Invalid email or password",
  "auth/too-many-requests": "Too many failed attempts. Please try again later",
  "auth/network-request-failed": "Network error. Please check your connection",
  "auth/invalid-email": "Please enter a valid email address",
  "auth/weak-password": "Password must be at least 6 characters",
  "auth/email-already-in-use": "This email is already registered",
  "auth/operation-not-allowed": "Email/password sign-in is not enabled",
  "auth/expired-action-code": "The sign-in link has expired",
  "auth/invalid-action-code": "The sign-in link is invalid",
  "auth/user-disabled": "This account has been disabled",
  "auth/requires-recent-login": "Please sign in again to continue",
  "auth/id-token-expired": "Session expired. Please sign in again",
};

export function getAuthErrorMessage(errorCode) {
  return AUTH_ERROR_MESSAGES[errorCode] || "Something went wrong. Please try again";
}