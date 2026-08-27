import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import DesignCard from "@/components/DesignCard";
import GalleryFilters from "@/components/GalleryFilters";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  category?: string;
  color?: string;
  q?: string;
}>;

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { category, color, q } = await searchParams;

  const where: Prisma.DesignWhereInput = {};

  if (category) {
    where.category = category;
  }

  if (color) {
    where.colors = { contains: color };
  }

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
    ];
  }

  const designs = await prisma.design.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">갤러리</h1>
      <p className="mt-1 text-sm opacity-70">
        다양한 네일아트 디자인을 카테고리와 색상으로 검색해보세요.
      </p>

      <div className="mt-8">
        <GalleryFilters category={category} color={color} q={q} />
      </div>

      {designs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {designs.map((design) => (
            <DesignCard
              key={design.id}
              slug={design.slug}
              title={design.title}
              category={design.category}
              colors={design.colors}
              imageUrl={design.imageUrl}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-black/10 p-10 text-center text-sm opacity-60 dark:border-white/10">
          조건에 맞는 디자인이 없습니다. 다른 필터를 시도해보세요.
        </p>
      )}
    </div>
  );
}
