/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-red-color': '#EF4444',
        'primary-blue-color': '#2A3964',
        'primary-black-color': '#212121',
        'secondary-button-color': '#282089',
        'optional-button-color': '#B2B2B2',
        'card-color': '#F1F1F1',
        'loaded-color': '#0AC228', 
        'secondary-red': '#FEF2F2',
        'border-red-color': '#FECACA',
        'text-color-cert': '#1e2b72',
        'text-color-subt-cert': '#ef7d30'
      },
    },
  },
  plugins: [],
}