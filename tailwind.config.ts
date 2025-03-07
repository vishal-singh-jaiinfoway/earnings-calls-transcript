// tailwind.config.js
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './app/**/*.{js,ts,jsx,tsx}',
      ],
    theme: {
      extend: {
        colors: {
          olive: '#808000',
          oliveLight: '#a9a94a', // Lighter shade of olive
        },
        animation: {
          'slide-in': 'slide-in 0.5s ease-out forwards'
        },
        keyframes: {
          'slide-in': {
            '0%': { opacity: 0, transform: 'translateX(-40px)' },
            '100%': { opacity: 1, transform: 'translateX(0)' }
          }
        }
      },
    },
    plugins: [],

  };
  