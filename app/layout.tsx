import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PWARegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "Personal finance tracker",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Finance",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#10b981",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="bg-[#0a0a0a] text-white font-sans antialiased min-h-screen">
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
