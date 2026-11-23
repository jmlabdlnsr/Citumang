import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";

const jakarta = localFont({
  src: "./fonts/plus-jakarta-sans.ttf",
  variable: "--font-jakarta",
  display: "swap",
  weight: "200 800",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
