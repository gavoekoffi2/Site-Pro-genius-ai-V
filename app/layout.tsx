import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { defaultLocale, getDictionary } from "@/lib/i18n";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NeuralBackground from "@/components/NeuralBackground";
import { SITE_URL } from "@/lib/site";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dict = getDictionary();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${dict.meta.siteName} — ${dict.meta.tagline}`,
    template: `%s — ${dict.meta.siteName}`,
  },
  description: dict.meta.description,
  keywords: [
    "intelligence artificielle",
    "IA Afrique",
    "agents IA",
    "automatisation IA",
    "SaaS IA",
    "startup africaine",
    "Pro Genius AI",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: dict.meta.siteName,
    title: `${dict.meta.siteName} — ${dict.meta.tagline}`,
    description: dict.meta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${dict.meta.siteName} — ${dict.meta.tagline}`,
    description: dict.meta.description,
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: SITE_URL,
    languages: { fr: SITE_URL },
  },
};

export const viewport: Viewport = {
  themeColor: "#030409",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={defaultLocale} className="noise">
      <body className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}>
        <SmoothScroll>
          <NeuralBackground />
          <Navbar />
          <main className="relative">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
