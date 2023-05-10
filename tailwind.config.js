/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  content: ["./client/**/*.html", "./client/**/*.js", "./client/**/*.jsx"],

  plugins: [],
};
