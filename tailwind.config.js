/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "level--1": "rgb(26, 21, 26)",
                "level-0": "rgb(32, 28, 32)",
                "level-1": "rgb(51, 47, 46)",
                "level-2": "rgb(117, 102, 98)",
                "primary-0": "#FFFFFF",
                "primary-1": "#CACACA",
                "primary-2": "#C9B9B9",
                "brand-accent": "#be2840",
                "url-1": "#CACAFF",
            },
            dropShadow: {
                "level-1": "0.5em 0.5em 0.5em rgba(0,0,0,0.4)",
                "level-2": "0.3em 0.3em 0.3em rgba(0,0,0,0.4)",
                "level-3": "0.1em 0.1em 0.1em rgba(0,0,0,0.4)",
            }
        },
    },
    plugins: []
}

