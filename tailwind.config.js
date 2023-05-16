/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    fontFamily: {
      display: ["Helvetica"],
      body: ['"system-ui"'],
    },
    extend: {
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  content: ["./client/**/*.html", "./client/**/*.js", "./client/**/*.jsx"],

  plugins: [],
};
