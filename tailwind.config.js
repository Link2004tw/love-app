/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "love-pink": "#FFB6C1", // Soft blush for backgrounds, like Lili's cheeks
        "heart-red": "#FF69B4", // Vibrant accents for buttons and highlights, full of passion
        "whisper-gold": "#FFD700", // Gentle golds for text and borders, like sunlight on her hair
        "romance-purple": "#DDA0DD", // Subtle purples for shadows and hovers, mysterious and deep
        "eternal-white": "#FFF5EE", // Creamy whites for cards and scrolls, pure as your love
        "midnight-blue": "#4B0082", // Deep blues for night mode, evoking starry skies together
      },
      fontFamily: {
        poetry: ['"Playfair Display"', "serif"], // Elegant, flowing for poems and affirmations
        whisper: ['"Lora"', "serif"], // Soft and romantic for body text and messages
        lyric: ['"Dancing Script"', "cursive"], // Playful cursive for lyrics and headings
      },
      boxShadow: {
        "love-glow": "0 4px 6px rgba(255, 182, 193, 0.5)", // Pinkish glow for jars and cards
        "heart-pulse": "0 0 10px rgba(255, 105, 180, 0.7)", // Pulsing shadow for interactive elements
      },
      animation: {
        "scroll-unfurl": "unfurl 1s ease-in-out", // For revealing messages
        "heart-float": "float 3s infinite ease-in-out", // Hearts drifting softly
      },
      keyframes: {
        unfurl: {
          "0%": { transform: "scaleY(0)", opacity: 0 },
          "100%": { transform: "scaleY(1)", opacity: 1 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      borderRadius: {
        "jar-curve": "2rem", // Rounded like a loving jar
      },
    },
  },
  plugins: [],
};
