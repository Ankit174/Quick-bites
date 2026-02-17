/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
            },
            colors: {
                primary: "#ff4d4d", // Zomato/Swiggy like red
                secondary: "#2b2b2b",
            }
        },
    },
    plugins: [],
}
