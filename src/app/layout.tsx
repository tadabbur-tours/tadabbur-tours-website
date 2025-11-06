import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const neuePlak = localFont({
  src: [
    {
      path: "./fonts/Neue Plak Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Neue Plak SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Neue Plak Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-neue-plak",
});

export const metadata: Metadata = {
  title: "Tadabbur Tours",
  description: "Experience the transformative journey of reflecting on Allah's words in the very lands where revelation shaped hearts and history.",
  icons: {
    icon: [
      { url: '/logo1.png', type: 'image/png', sizes: '32x32' },
      { url: '/logo1.png', type: 'image/png', sizes: '192x192' },
      { url: '/logo1.png', type: 'image/png' },
    ],
    apple: [
      { url: '/logo1.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/logo1.png',
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
        className={`${geistSans.variable} ${geistMono.variable} ${neuePlak.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
