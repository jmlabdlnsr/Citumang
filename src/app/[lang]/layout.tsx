import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/messages";
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <div lang={lang} className="flex min-h-full flex-col">{children}</div>;
}
