import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DesignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const design = await prisma.design.findUnique({ where: { slug } });

  if (!design) {
    notFound();
  }

  const colorList = design.colors
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href="/gallery"
        className="text-sm font-medium text-accent hover:underline"
      >
        ← 갤러리로 돌아가기
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl bg-accent-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={design.imageUrl}
            alt={design.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
            {design.category}
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            {design.title}
          </h1>

          {colorList.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {colorList.map((color) => (
                <span
                  key={color}
                  className="rounded-full border border-black/10 px-3 py-1 text-xs opacity-80 dark:border-white/10"
                >
                  {color}
                </span>
              ))}
            </div>
          )}

          <p className="mt-6 whitespace-pre-line leading-relaxed opacity-90">
            {design.description}
          </p>
        </div>
      </div>
    </div>
  );
}
