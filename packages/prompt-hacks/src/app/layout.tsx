import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "@/components/layout/Header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prompt Hacks",
  description: "The fastest way to find, copy, and use professional AI prompts — for free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased min-h-screen flex flex-col bg-white`}
      >
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="w-full py-4 text-center border-t text-sm text-gray-500">
          © {new Date().getFullYear()} Prompt Hacks. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
