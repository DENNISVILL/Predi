/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                // Reuse web colors if needed, but Tailwind defaults are usually close.
                // We can add custom colors from the web theme later.
            },
        },
    },
    plugins: [],
}
