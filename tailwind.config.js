/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                creepster: ['Creepster', 'cursive'],
                nosifer: ['Nosifer', 'cursive'],
            },
            colors: {
                blood: '#ff0033',
            },
        },
    },
    plugins: [],
}
