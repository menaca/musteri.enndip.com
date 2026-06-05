import type { Config } from "tailwindcss";

/**
 * Tasarım token'ları Flutter uygulamasıyla (lib/app/theme/*) ve
 * outofcontext/main-page ile birebir hizalıdır. Tek doğru kaynak: enndip mobil.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1240px",
      },
    },
    extend: {
      colors: {
        // Çekirdek (ink/paper)
        ink: {
          DEFAULT: "#0B0B0B",
          900: "#111111",
          700: "#1C1C1C",
        },
        paper: "#FFFFFF",
        // Yüzeyler — Flutter app_colors.dart eşlemesi
        cream: "#F4F4F4", // surfaceMuted
        sand: "#EFEFEF", // surfaceSoft
        card: "#F6F6F6", // surfaceCard
        "logo-circle": "#F0F0F0", // brandLogoCircle
        // Metin
        muted: {
          DEFAULT: "#6B6B6B", // textSecondary
          soft: "#A0A0A0", // textTertiary
        },
        // Sınırlar
        line: {
          DEFAULT: "#E5E5E5", // border
          strong: "#CFCFCF", // borderStrong
        },
        // Anlamsal
        accent: "#3C8A4A", // offerInfoGreen
        success: "#2BA463",
        danger: "#D13B3B",
        warning: "#E8A23B",
        link: "#1A73E8",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        // Flutter AppRadius: s8 / m12 / l16 / xl20 / pill
        sm: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.25rem",
        "3xl": "1.75rem",
        pill: "999px",
      },
      spacing: {
        // 4pt scale (Flutter AppSpacing)
        "4.5": "1.125rem",
      },
      maxWidth: {
        prose2: "44rem",
        app: "1240px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,11,11,0.04), 0 12px 32px -16px rgba(11,11,11,0.18)",
        float: "0 24px 60px -28px rgba(11,11,11,0.45)",
        drawer: "0 0 60px -12px rgba(11,11,11,0.35)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-up-sheet": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        "marquee-slow": "marquee 60s linear infinite",
        "fade-up": "fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.3s ease both",
        "slide-in-left": "slide-in-left 0.28s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-up-sheet": "slide-up-sheet 0.32s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
