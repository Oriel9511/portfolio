/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: {
					50: 'rgb(238 242 255)',
					100: 'rgb(224 231 255)',
					200: 'rgb(199 210 254)',
					300: 'rgb(165 180 252)',
					400: 'rgb(129 140 248)',
					500: 'rgb(99 102 241)',
					600: 'rgb(79 70 229)',
					700: 'rgb(67 56 202)',
					800: 'rgb(55 48 163)',
					900: 'rgb(49 46 129)',
				},
				secondary: {
					50: 'rgb(240 249 255)',
					100: 'rgb(224 242 254)',
					200: 'rgb(186 230 253)',
					300: 'rgb(125 211 252)',
					400: 'rgb(56 189 248)',
					500: 'rgb(14 165 233)',
					600: 'rgb(2 132 199)',
					700: 'rgb(3 105 161)',
					800: 'rgb(7 89 133)',
					900: 'rgb(12 74 110)',
				},
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			animation: {
				'float': 'float 6s ease-in-out infinite',
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'shimmer': 'shimmer 2s ease-in-out infinite',
				'bounce-in': 'bounceIn 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'scale-in': 'scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
				'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
			},
			backdropBlur: {
				xs: '2px',
			},
			boxShadow: {
				'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
				'glow-lg': '0 0 40px rgba(99, 102, 241, 0.4)',
			},
		},
	},
	plugins: [],
}
