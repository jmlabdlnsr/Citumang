import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomePage from "@/components/home-page";
import { isLocale, messages } from "@/lib/messages";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const content = messages[lang].metadata;

  return {
    title: content.title,
    description: content.description,
    icons: { icon: "/icon.svg" },
    openGraph: {
      title: content.title,
      description: content.openGraphDescription,
      locale: content.openGraphLocale,
      type: "website",
    },
  };
}

export default async function Home({
  params,
}: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <HomePage locale={lang} />;
}
