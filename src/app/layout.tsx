import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnapMark — Annotate. Blur. Share. AI-Powered Screenshots.",
  description:
    "SnapMark is a screenshot + annotation tool with AI auto-blur for sensitive info (emails, phones, cards, IDs). Capture, annotate, and share in one click.",
  keywords: [
    "screenshot",
    "annotation",
    "AI blur",
    "sensitive info",
    "chrome extension",
    "bug report",
    "SnapMark",
  ],
  authors: [{ name: "SnapMark" }],
  openGraph: {
    title: "SnapMark — AI-Powered Screenshot Annotation",
    description:
      "Capture, annotate with arrows/highlights/blur, auto-detect sensitive info, share in one click.",
    siteName: "SnapMark",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster />
        <SonnerToaster richColors closeButton position="bottom-right" />
      </body>
    </html>
  );
}
