/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        keyframes: {
          swipe: {
            "0%": { transform: "translateX(0)" },
            "50%": { transform: "translateX(8px)" },
            "100%": { transform: "translateX(0)" },
          },
        },
        animation: {
          "swipe-right": "swipe 1s ease-in-out infinite",
        },
      },
    },
    plugins: [],
  };
  