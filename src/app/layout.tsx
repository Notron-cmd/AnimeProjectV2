import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ToastProvider } from "@/components/ui/toast";

const playfairDisplayHeading = Playfair_Display({subsets:['latin'],variable:'--font-heading', display:'swap'});
const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans', display:'swap'});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: "AniVision - Anime Platform", template: "%s | AniVision" },
  description: "Discover and track your favorite anime. Browse trending, seasonal, and top-rated anime, build your personal library, and never miss new episodes.",
  icons: {
    icon: '/Logo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "dark", "antialiased", geistSans.variable, geistMono.variable, "font-sans", notoSans.variable, playfairDisplayHeading.variable)}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0" 
        />
      </head>
      <body className="bg-[#121317] min-h-full flex flex-col text-foreground">
        
        <LayoutWrapper>
          <ToastProvider>
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </ToastProvider>
        </LayoutWrapper>
        
      </body>
    </html>
  );
}