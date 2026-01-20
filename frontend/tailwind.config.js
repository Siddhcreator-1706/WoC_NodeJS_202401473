/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'halloween-dark': '#0f0e13',
                'halloween-darker': '#050505',
                'halloween-orange': '#ff6b00',
                'halloween-orange-dim': '#bd4f00',
                'halloween-purple': '#b026ff',
                'halloween-purple-dim': '#7c1ac0',
                'halloween-card': '#1a191f',
                'halloween-text': '#e0e0e0',
            },
            fontFamily: {
                'spooky': ['"Creepster"', 'cursive'],
                'sans': ['"Inter"', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
