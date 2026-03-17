import type { Metadata } from "next";
import {
  Amiri,
  Dongle,
  Geist_Mono,
  IBM_Plex_Sans,
  Inter,
  Nunito,
  Open_Sans,
} from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/ToastProvider";

const bodyFont = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const baseFont = IBM_Plex_Sans({
  variable: "--font-base",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const displayFont = Dongle({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const headingFont = Open_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const buttonFont = Inter({
  variable: "--font-button",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const arabicFont = Amiri({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Al-Hayaat School',
    default: 'Al-Hayaat School',
  },
  description: 'Al-Hayaat School — Nurturing young minds through academic excellence and spiritual development.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bodyFont.variable} ${baseFont.variable} ${displayFont.variable} ${headingFont.variable} ${buttonFont.variable} ${arabicFont.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
