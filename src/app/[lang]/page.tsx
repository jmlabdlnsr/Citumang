import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import HomePage from "@/components/home-page";
import { isLocale, messages } from "@/lib/messages";
import {
  getPublicPackages,
  getPublicGallery,
  getPublicArticles,
  getPublicFaq,
} from "@/lib/queries";

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

  // Fetch semua data dari DB secara paralel
  await connection();
  const [dbPackages, dbGallery, dbArticles, dbFaq] = await Promise.all([
    getPublicPackages(),
    getPublicGallery(),
    getPublicArticles(6),
    getPublicFaq(),
  ]);

  return (
    <HomePage
      locale={lang}
      dbPackages={dbPackages}
      dbGallery={dbGallery}
      dbArticles={dbArticles}
      dbFaq={dbFaq}
    />
  );
}
