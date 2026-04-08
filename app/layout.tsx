import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import InstallPrompt from "@/components/InstallPrompt";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2a5f8f",
};

export const metadata: Metadata = {
  title: {
    default: "Vybe - Express Yourself. Connect for Real.",
    template: "%s | Vybe",
  },
  description:
    "Your profile, your way. Customize your page with colors, music, and vibes. Add friends, leave comments on walls, and make your corner of the internet feel like you.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Vybe",
  },
  openGraph: {
    title: "Vybe - Express Yourself. Connect for Real.",
    description:
      "Customize your profile with colors, music, and vibes. Connect with friends the way the internet used to be.",
    siteName: "Vybe",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Vybe - Express Yourself. Connect for Real.",
    description:
      "Customize your profile with colors, music, and vibes. Connect with friends the way the internet used to be.",
  },
  icons: {
    apple: "/icons/icon-152x152.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <InstallPrompt />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
