/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
        'fadeInUp': 'fadeInUp 0.8s ease-out forwards',
        'pulse': 'pulse 3s infinite',
        'breathe': 'breathe 2s infinite',
        'wave': 'wave 1s ease-in-out infinite',
        'blink': 'blink 2s infinite',
        'fadeInScale': 'fadeInScale 0.5s ease-out forwards',
        'messageSlide': 'messageSlide 0.4s ease-out forwards',
        'typingDot': 'typingDot 1.4s infinite',
        'matchPop': 'matchPop 0.5s ease-out forwards',
        'rippleEffect': 'rippleEffect 2s ease-out',
        'fadeConnection': 'fadeConnection 2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          'to': { opacity: '1' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { opacity: '0.5' },
          '100%': { transform: 'scale(1.2)', opacity: '0' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.8)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        fadeInScale: {
          'from': { opacity: '0', transform: 'scale(0.8)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        messageSlide: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        typingDot: {
          '0%, 60%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '30%': { opacity: '1', transform: 'scale(1.2)' },
        },
        matchPop: {
          'to': { transform: 'translate(-50%, -50%) scale(1)' },
        },
        rippleEffect: {
          'from': { width: '0', height: '0', opacity: '1' },
          'to': { width: '100px', height: '100px', opacity: '0' },
        },
        fadeConnection: {
          '0%': { opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
} 