"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { PrimaryButton } from "../ui/PrimaryButton"; //from "./ui/PrimaryButton";
import { getAuthErrorMessage } from "@/lib/authErrors";

/**
 * AuthForm - Reusable authentication form component
 *
 * @param {Object} props
 * @param {string} [props.mode="signIn"] - Form mode: "signIn" | "signUp" | "update"
 * @param {Function} props.onSubmit - Async function to handle form submission
 * @param {Function} [props.onSwitchMode] - Callback when user wants to switch between signIn/signUp
 */
export default function AuthForm({ mode = "signIn", onSubmit, onSwitchMode }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: mode === "signUp" ? "" : "",
    confirmPassword: mode === "signUp" ? "" : "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      return false;
    }

    if (mode === "signUp" && !formData.displayName) {
      toast.error("Display name is required");
      return false;
    }

    if (mode === "signUp" && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    if (mode === "update" && !formData.displayName) {
      toast.error("Display name is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await onSubmit({
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName,
        mode,
      });
    } catch (err) {
      const errorMessage = err.code
        ? getAuthErrorMessage(err.code)
        : err.message || "Something went wrong. Please try again";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "signUp":
        return "Welcome, Beautiful Soul";
      case "signIn":
        return "Welcome Back, Love";
      case "update":
        return "Update Your Profile";
      default:
        return "Sign In";
    }
  };

  const getButtonText = () => {
    switch (mode) {
      case "signUp":
        return "Create My Account";
      case "signIn":
        return "Sign In";
      case "update":
        return "Update Profile";
      default:
        return "Sign In";
    }
  };

  const getSubText = () => {
    switch (mode) {
      case "signUp":
        return "Join our loving community today!";
      case "signIn":
        return "We're so happy you're back!";
      case "update":
        return "Let us know more about you!";
      default:
        return "Let's get you signed in";
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-8 bg-white rounded-xl shadow-lg border border-pink-100">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{getTitle()}</h1>
        <p className="text-gray-600">{getSubText()}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
            placeholder="your.lovely@email.com"
            required
            disabled={loading}
          />
        </div>

        {(mode === "signUp" || mode === "update") && (
          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              placeholder="What's your lovely name?"
              required
              disabled={loading}
            />
          </div>
        )}

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
            placeholder="Your secret password"
            required
            disabled={loading}
          />
        </div>

        {mode === "signUp" && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
          </div>
        )}

        <PrimaryButton
          type="submit"
          disabled={loading}
          fullWidth
          size="lg"
          className="rounded-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            getButtonText()
          )}
        </PrimaryButton>
      </form>

      {(mode === "signIn" || mode === "signUp") && onSwitchMode && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {mode === "signIn" ? "New here? " : "Already have an account? "}
            <button
              onClick={() =>
                onSwitchMode(mode === "signIn" ? "signUp" : "signIn")
              }
              className="font-semibold text-pink-600 hover:text-pink-700 transition-colors duration-200"
            >
              {mode === "signIn" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      )}

      {mode === "signUp" && (
        <div className="mt-4 p-3 bg-pink-50 rounded-lg text-center">
          <p className="text-xs text-pink-600 italic">
            "Every new beginning comes from some other beginning's end."
          </p>
        </div>
      )}
    </div>
  );
}
