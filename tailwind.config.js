/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./client/**/*.html", "./client/**/*.js", "./client/**/*.jsx"],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  plugins: [],
};
