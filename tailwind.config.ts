import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            boxShadow: {
                sm: '0 1px 1px 0 rgb(0 0 0 / 0.05), 0 1px 2px 0 rgb(0 0 0 / 0.02)',
            },
            colors: {
                gray: {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#BFC4CD',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                    950: '#030712',
                },
                violet: {
                    50: '#F1EEFF',
                    100: '#E6E1FF',
                    200: '#D2CBFF',
                    300: '#B7ACFF',
                    400: '#9C8CFF',
                    500: '#8470FF',
                    600: '#755FF8',
                    700: '#5D47DE',
                    800: '#4634B1',
                    900: '#2F227C',
                    950: '#1C1357',
                },
                sky: {
                    50: '#E3F3FF',
                    100: '#D1ECFF',
                    200: '#B6E1FF',
                    300: '#A0D7FF',
                    400: '#7BC8FF',
                    500: '#67BFFF',
                    600: '#56B1F3',
                    700: '#3193DA',
                    800: '#1C71AE',
                    900: '#124D79',
                    950: '#0B324F',
                },
                green: {
                    50: '#D2FFE2',
                    100: '#B1FDCD',
                    200: '#8BF0B0',
                    300: '#67E294',
                    400: '#4BD37D',
                    500: '#3EC972',
                    600: '#34BD68',
                    700: '#239F52',
                    800: '#15773A',
                    900: '#0F5429',
                    950: '#0A3F1E',
                },
                red: {
                    50: '#FFE8E8',
                    100: '#FFD1D1',
                    200: '#FFB2B2',
                    300: '#FF9494',
                    400: '#FF7474',
                    500: '#FF5656',
                    600: '#FA4949',
                    700: '#E63939',
                    800: '#C52727',
                    900: '#941818',
                    950: '#600F0F',
                },
                yellow: {
                    50: '#FFF2C9',
                    100: '#FFE7A0',
                    200: '#FFE081',
                    300: '#FFD968',
                    400: '#F7CD4C',
                    500: '#F0BB33',
                    600: '#DFAD2B',
                    700: '#BC9021',
                    800: '#816316',
                    900: '#4F3D0E',
                    950: '#342809',
                },
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))',
                },
            },
            outline: {
                blue: '2px solid rgba(0, 112, 244, 0.5)',
            },
            spacing: {
                128: '32rem',
                '9/16': '56.25%',
                '3/4': '75%',
                '1/1': '100%',
            },
            fontFamily: {
                inter: ['var(--font-inter)', 'sans-serif'],
                'red-hat-display': ['var(--font-red-hat-display)', 'sans-serif'],
                hacen: ['var(--font-hacen)', 'sans-serif'],
                arslan: ['var(--font-arslan)', 'sans-serif'],
                aspekta: ['var(--font-aspekta)', 'sans-serif'],
                'cabinet-grotesk': ['var(--font-cabinet-grotesk)', 'sans-serif'],
            },
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1.5' }],
                sm: ['0.875rem', { lineHeight: '1.5715' }],
                base: ['1rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
                lg: ['1.125rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
                xl: ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
                '2xl': ['1.5rem', { lineHeight: '1.415', letterSpacing: '0' }],
                '3xl': ['1.875rem', { lineHeight: '1.333', letterSpacing: '0' }],
                '4xl': ['2.25rem', { lineHeight: '1', letterSpacing: '0' }],
                '5xl': ['3rem', { lineHeight: '1', letterSpacing: '0' }],
                '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '0' }],
                '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '0' }],
            },
            inset: {
                '1/2': '50%',
                full: '100%',
            },
            letterSpacing: {
                tighter: '-0.02em',
                tight: '-0.01em',
                normal: '0',
                wide: '0.01em',
                wider: '0.02em',
                widest: '0.4em',
            },
            minWidth: {
                10: '2.5rem',
            },
            scale: {
                98: '.98',
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                float: 'float 5s ease-in-out infinite',
                'code-1': 'code-1 8s ease-in-out infinite',
                'code-2': 'code-2 8s ease-in-out infinite',
                'code-3': 'code-3 8s ease-in-out infinite',
                'code-4': 'code-4 8s ease-in-out infinite',
                'code-5': 'code-5 8s ease-in-out infinite',
                'code-6': 'code-6 8s ease-in-out infinite',
                breath: 'breath 6s ease-in-out infinite',
                line: 'line 2s ease-in-out infinite',
                'infinite-scroll': 'infinite-scroll 25s linear infinite',
            },
            zIndex: {
                '-1': '-1',
                '-10': '-10',
            },
            width: {
                '1/7': '14.2857143%',
                '2/7': '28.5714286%',
                '3/7': '42.8571429%',
                '4/7': '57.1428571%',
                '5/7': '71.4285714%',
                '6/7': '85.7142857%',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                'code-1': {
                    '0%': { opacity: '0' },
                    '2.5%': { opacity: '1' },
                    '97.5%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                'code-2': {
                    '16.2%': { opacity: '0' },
                    '18.75%': { opacity: '1' },
                    '97.5%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                'code-3': {
                    '32.5%': { opacity: '0' },
                    '35%': { opacity: '1' },
                    '97.5%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                'code-4': {
                    '48.75%': { opacity: '0' },
                    '51.25%': { opacity: '1' },
                    '97.5%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                'code-5': {
                    '65%': { opacity: '0' },
                    '72.5%': { opacity: '1' },
                    '97.5%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                'code-6': {
                    '81.25%': { opacity: '0' },
                    '83.75%': { opacity: '1' },
                    '97.5%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                breath: {
                    '0%, 100%': { transform: 'scale(0.95)' },
                    '50%': { transform: 'scale(1.1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5%)' },
                },
                line: {
                    '0%, 100%': { left: '0', opacity: '0' },
                    '50%': { left: '100%', transform: 'translateX(-100%)' },
                    '10%, 40%, 60%, 90%': { opacity: '0' },
                    '25%, 75%': { opacity: '1' },
                },
                'infinite-scroll': {
                    from: { transform: 'translateX(0)' },
                    to: { transform: 'translateX(-100%)' },
                },
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};

export default config;
