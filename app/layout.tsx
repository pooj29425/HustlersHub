import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import MinikitProvider from "@/components/hustlers/Minikit-Provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "HustlersHub",
  description: "The bot-proof marketplace for human micro-tasks.",
  generator: "v0.app",
};

// Inter for headings and body
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark antialiased ${inter.variable}`}>
      <MinikitProvider>
        <body className="font-sans bg-background text-foreground">
          <Suspense fallback={null}>
            {children}
            <Analytics />
          </Suspense>
          <Toaster />
        </body>
      </MinikitProvider>
    </html>
  );
}
