import type { Metadata } from "next";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://nirotanman.example.com"),
  title: {
    default: "Niro Ayurveda — Ancient wisdom, modern care",
    template: "%s · Niro Ayurveda",
  },
  description:
    "Book verified Ayurvedic doctors, get an AI-guided wellness plan, and follow personalised diet, yoga and lifestyle routines — all in one calm, modern platform.",
  openGraph: {
    title: "Niro Ayurveda — Ancient wisdom, modern care",
    description:
      "Book verified Ayurvedic doctors, get an AI-guided wellness plan, and follow personalised routines.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Niro Ayurveda — Ancient wisdom, modern care",
    description:
      "Book verified Ayurvedic doctors, get an AI-guided wellness plan.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://nirotanman.example.com" },
  manifest: "/manifest.json",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="font-body antialiased bg-canvas text-forest dark:bg-canvas-dark dark:text-mint"
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
