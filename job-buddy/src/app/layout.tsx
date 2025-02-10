import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JobBuddy - AI-Powered Career Tools",
  description: "Your all-in-one platform for interview preparation, study planning, and career development",
  keywords: "interview preparation, study plan, cover letter, AI career tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800`}
      >
        {children}
      </body>
    </html>
  );
}
