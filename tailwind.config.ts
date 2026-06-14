import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
        "outline-variant": "#c2c7ce",
        "on-tertiary": "#ffffff",
        "on-error-container": "#93000a",
        "on-secondary-fixed": "#001e2f",
        "on-secondary": "#ffffff",
        "secondary-container": "#99d2ff",
        "secondary-fixed-dim": "#94cdf9",
        "on-surface": "#001b3f",
        "secondary": "#24648a",
        "primary-fixed": "#cde5ff",
        "surface-tint": "#396285",
        "tertiary-fixed": "#a6eeff",
        "primary": "#002239",
        "secondary-fixed": "#cae6ff",
        "primary-container": "#023859",
        "on-primary": "#ffffff",
        "tertiary": "#00242b",
        "background": "#f9f9ff",
        "error-container": "#ffdad6",
        "surface-container-highest": "#d7e3ff",
        "surface-variant": "#d7e3ff",
        "on-primary-fixed-variant": "#1e4a6c",
        "tertiary-fixed-dim": "#7dd3e7",
        "surface-container-low": "#f1f3ff",
        "error": "#ba1a1a",
        "surface-dim": "#cadaff",
        "on-secondary-fixed-variant": "#004b6f",
        "primary-fixed-dim": "#a2cbf3",
        "tertiary-container": "#003b45",
        "on-tertiary-container": "#51aabd",
        "on-surface-variant": "#42474e",
        "inverse-primary": "#a2cbf3",
        "surface-container-lowest": "#ffffff",
        "on-error": "#ffffff",
        "outline": "#72777e",
        "on-background": "#001b3f",
        "on-tertiary-fixed-variant": "#004e5b",
        "on-secondary-container": "#185b82",
        "surface-bright": "#f9f9ff",
        "inverse-surface": "#193055",
        "surface": "#f9f9ff",
        "surface-container": "#e8eeff",
        "on-primary-fixed": "#001d32",
        "on-tertiary-fixed": "#001f25",
        "inverse-on-surface": "#ecf0ff",
        "on-primary-container": "#79a2c8",
        "surface-container-high": "#dfe8ff",
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  		},
  		borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem",
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
      spacing: {
        "lg": "2.5rem",
        "xl": "4rem",
        "md": "1.5rem",
        "sm": "1rem",
        "unit": "4px",
        "container-max": "1280px",
        "xs": "0.5rem",
        "gutter": "24px",
        "margin-mobile": "16px"
      },
      fontFamily: {
        "display-lg": ["Source Serif 4", "serif"],
        "body-md": ["Inter", "sans-serif"],
        "headline-md": ["Source Serif 4", "serif"],
        "caption": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "headline-lg": ["Source Serif 4", "serif"],
        "label-md": ["Inter", "sans-serif"],
        "title-lg": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Source Serif 4", "serif"]
      },
      fontSize: {
        "display-lg": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "body-md": ["16px", {"lineHeight": "1.5", "fontWeight": "400"}],
        "headline-md": ["24px", {"lineHeight": "1.3", "fontWeight": "600"}],
        "caption": ["12px", {"lineHeight": "1.4", "fontWeight": "400"}],
        "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "headline-lg": ["32px", {"lineHeight": "1.2", "fontWeight": "600"}],
        "label-md": ["14px", {"lineHeight": "1.2", "letterSpacing": "0.05em", "fontWeight": "500"}],
        "title-lg": ["20px", {"lineHeight": "1.4", "fontWeight": "600"}],
        "headline-lg-mobile": ["24px", {"lineHeight": "1.2", "fontWeight": "600"}]
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
