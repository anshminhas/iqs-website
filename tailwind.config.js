/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6E9F4',
          100: '#C1C7E2',
          200: '#99A3CF',
          300: '#707FBC',
          400: '#4F63AD',
          500: '#2E479E',
          600: '#192657', // Main navy blue
          700: '#131D42',
          800: '#0D142D',
          900: '#060A18',
        },
        secondary: {
          50: '#F9F9F9',
          100: '#F2F2F2',
          200: '#E8E8E8',
          300: '#DEDEDE',
          400: '#D4D4D4',
          500: '#C0C0C0', // Main silver
          600: '#A0A0A0',
          700: '#808080',
          800: '#606060',
          900: '#404040',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        accent: '#6366F1',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'elevation-1': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        'elevation-2': '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        'elevation-3': '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
        'elevation-4': '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
        'elevation-5': '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-in-out',
        'slide-down': 'slideDown 0.6s ease-in-out',
      },
    },
  },
  plugins: [],
};