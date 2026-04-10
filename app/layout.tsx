import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import InstallPrompt from "@/components/InstallPrompt";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
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
    <html lang="en" className={`${jakarta.variable} dark`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem('vybe-theme')||'dark';document.documentElement.className=document.documentElement.className.replace(/light|dark/g,'')+' '+t}catch{}`,
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors"
        style={{ fontFamily: "var(--font-jakarta), system-ui, sans-serif" }}
      >
        <ThemeProvider>
          {children}
          <InstallPrompt />
        </ThemeProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
