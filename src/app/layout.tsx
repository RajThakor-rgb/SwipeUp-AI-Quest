import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rajthakor-rgb.github.io/SwipeUp-AI-Quest/"),
  title: "SwipeUp AI Quest - AI Literacy for Business Students",
  description: "Master AI fundamentals, tools, ethics, and practical business applications through interactive missions designed for future business leaders.",
  keywords: ["AI", "Artificial Intelligence", "Business Students", "Education", "SwipeUp", "AI Literacy", "Learning"],
  authors: [{ name: "SwipeUp AI Society" }],
  icons: {
    icon: "/SwipeUp-AI-Quest/swipeup-logo.jpeg",
    apple: "/SwipeUp-AI-Quest/swipeup-logo.jpeg",
  },
  openGraph: {
    title: "SwipeUp AI Quest",
    description: "AI Literacy for Business Students - Interactive learning missions",
    url: "https://rajthakor-rgb.github.io/SwipeUp-AI-Quest/",
    siteName: "SwipeUp AI Quest",
    type: "website",
    images: [
      {
        url: "/SwipeUp-AI-Quest/swipeup-logo.jpeg",
        width: 1200,
        height: 630,
        alt: "SwipeUp AI Quest",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SwipeUp AI Quest",
    description: "AI Literacy for Business Students - Interactive learning missions",
    images: ["/SwipeUp-AI-Quest/swipeup-logo.jpeg"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
