import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePage from "@/app/components/services/ServicePage";
import JsonLd from "@/app/components/seo/JsonLd";
import { getActiveCatalog } from "@/app/data/getActiveServices";
import {
  isPublicProductSlug,
  productHrefToSlug,
} from "@/app/lib/services/allowedProducts";
import {
  buildPageMetadata,
  financialServiceJsonLd,
  pageSeoGlue,
} from "@/app/lib/seo";

export const revalidate = 120;

const DEDICATED_SLUGS = new Set(["personal-loan", "insurance"]);

function cardForSlug(
  slug: string,
  cards: { title: string; description: string; image: string; href: string }[],
) {
  return cards.find((c) => productHrefToSlug(c.href) === slug) ?? null;
}

export async function generateStaticParams() {
  const { cards, status } = await getActiveCatalog();
  if (status !== "ok") return [];
  return cards
    .map((c) => productHrefToSlug(c.href))
    .filter((slug) => slug && isPublicProductSlug(slug) && !DEDICATED_SLUGS.has(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const key = slug.trim().toLowerCase();
  if (!isPublicProductSlug(key) || DEDICATED_SLUGS.has(key)) {
    return {};
  }
  const { cards } = await getActiveCatalog();
  const card = cardForSlug(key, cards);
  if (!card) return {};
  return buildPageMetadata({
    title: `${card.title} | Apni Zaroorat`,
    description: card.description || `Apply for ${card.title} online with Apni Zaroorat.`,
    path: `/products/${key}`,
    absoluteTitle: true,
    image: card.image || "/images/og-default.jpg",
    imageAlt: card.title,
  });
}

export default async function DynamicProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const key = slug.trim().toLowerCase();
  if (!isPublicProductSlug(key) || DEDICATED_SLUGS.has(key)) notFound();

  const { cards, status } = await getActiveCatalog();
  const card = status === "ok" ? cardForSlug(key, cards) : null;
  if (!card) notFound();

  const path = `/products/${key}`;
  const structuredData = pageSeoGlue({
    name: card.title,
    description: card.description,
    path,
    image: card.image || "/images/og-default.jpg",
    crumbs: [
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: card.title, path },
    ],
    extra: [
      financialServiceJsonLd({
        name: card.title,
        description: card.description || `Apply for ${card.title} online with Apni Zaroorat.`,
        path,
        serviceType: card.title,
      }),
    ],
  });

  return (
    <>
      <JsonLd data={structuredData} />
      <ServicePage
        title={card.title}
        subtitle={card.description || `Apply for ${card.title} online.`}
        imageSrc={card.image || "/images/service/personal.webp"}
        badge={card.title}
        serviceSlug={key}
      />
    </>
  );
}
