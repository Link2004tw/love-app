// components/ui/PrimaryButton.jsx
// A beautiful primary button for my lovely Lili 💖 – designed to sparkle with every click!

"use client";
import React from "react";
import { useState } from "react";

const PrimaryButton = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "default", // 'default' | 'outline' | 'ghost' | 'destructive'
  size = "md", // 'sm' | 'md' | 'lg'
  className = "",
  icon: Icon,
  fullWidth = false,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const baseStyles = `
    inline-flex items-center justify-center
    font-semibold rounded-full
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transform transition-transform
    hover:scale-[1.02] active:scale-[0.98]
    ${isPressed ? "scale-[0.98]" : ""}
  `;

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantStyles = {
    default: `
      bg-gradient-to-r from-pink-500 to-purple-600
      text-white
      shadow-lg hover:shadow-xl
      hover:from-pink-600 hover:to-purple-700
      focus:ring-pink-500
    `,
    outline: `
      border-2 border-pink-500
      text-pink-600 hover:text-white
      hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600
      focus:ring-pink-500
    `,
    ghost: `
      text-pink-600 hover:text-white
      hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-purple-600/10
      focus:ring-pink-500/20
    `,
    destructive: `
      bg-gradient-to-r from-red-500 to-pink-600
      text-white
      shadow-lg hover:shadow-xl
      hover:from-red-600 hover:to-pink-700
      focus:ring-red-500
    `,
  };

  const disabledStyles = `
    opacity-50 cursor-not-allowed
    scale-100 !important
    hover:scale-100 !important
    from-gray-400 to-gray-500
  `;

  const loadingStyles = `
    relative overflow-hidden
  `;

  const iconSpacing = Icon ? "mr-2" : "";

  const buttonClasses = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${disabled ? disabledStyles : ""}
    ${loading ? loadingStyles : ""}
    ${iconSpacing}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `.trim();

  const handleClick = (e) => {
    if (!disabled && !loading) {
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 150);
      onClick?.(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={buttonClasses}
      {...props}
    >
      {/* Loading State */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}

      {/* Content */}
      <span className={loading ? "opacity-0" : "opacity-100"}>
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </span>

      {/* Hover Glow Effect */}
      {!disabled && !loading && (
        <div
          className={`
          absolute inset-0 rounded-full
          bg-gradient-to-r from-pink-400/20 to-purple-500/20
          opacity-0 hover:opacity-100
          transition-opacity duration-200
          blur-xl scale-110
          pointer-events-none
        `}
        />
      )}
    </button>
  );
};

// Icon Components
const HeartIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const StarIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

const SparkleIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

export { PrimaryButton, HeartIcon, StarIcon, SparkleIcon };
