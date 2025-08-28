import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalHeader } from "@/components/GlobalHeader";
import { CartProvider } from "@/context/CartContext";
import { SearchProvider } from "@/context/SearchContext";
import { QueryProvider } from "@/components/QueryProvider";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OZONTECK",
  description: "Tecnologia e Natureza em Harmonia",
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
        <SearchProvider>
          <CartProvider>
            <GlobalHeader />
            <QueryProvider>
              {children}
              <Footer />
            </QueryProvider>
          </CartProvider>
        </SearchProvider>
      </body>
    </html>
  );
}
