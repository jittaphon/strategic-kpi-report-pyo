/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"], // ← สำคัญมาก
  theme: {
   extend: {
      fontFamily: {
        sans: ['Prompt', 'sans-serif'], // ตั้ง default ให้เป็น Prompt
      },
    },
  },
  plugins: [],
};
