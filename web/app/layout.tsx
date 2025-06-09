import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/utils/ClientProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Promptic",
  description: "AI Prompt Management Platform",
  openGraph: {
    title: "Promptic",
    description: "AI Prompt Management Platform",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Promptic Preview Image",
      },
    ],
    type: "website",
    siteName: "Promptic",
    locale: "en_US",
    url: "https://promptic.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Promptic",
    description: "AI Prompt Management Platform",
    images: ["/preview.png"],
    site: "@prompticapp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
