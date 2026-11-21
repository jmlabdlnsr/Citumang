import { notFound } from "next/navigation";
import localFont from "next/font/local";
import { isLocale, locales } from "@/lib/messages";
import "../globals.css";

const jakarta = localFont({
  src: "../fonts/plus-jakarta-sans.ttf",
  variable: "--font-jakarta",
  display: "swap",
  weight: "200 800",
});
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
