/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'halloween-dark': '#121212',
                'halloween-orange': '#ff7518',
                'halloween-purple': '#9d00ff',
                'halloween-card': '#1e1e1e',
            },
            fontFamily: {
                'spooky': ['"Creepster"', 'cursive'],
                'sans': ['"Inter"', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
