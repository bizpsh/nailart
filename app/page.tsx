import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DesignCard from "@/components/DesignCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featuredDesigns = await prisma.design.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div>
      <section className="bg-blush">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Nailart
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance opacity-80">
            아름다운 네일아트 디자인 갤러리. 트렌디한 스타일부터 클래식한
            디자인까지, 마음에 드는 네일아트를 찾아보세요.
          </p>
          <Link
            href="/gallery"
            className="mt-8 inline-block rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            갤러리 둘러보기
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-bold tracking-tight">추천 디자인</h2>
        <p className="mt-1 text-sm opacity-70">
          엄선된 인기 네일아트 디자인을 만나보세요.
        </p>

        {featuredDesigns.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredDesigns.map((design) => (
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
          <p className="mt-8 rounded-xl border border-dashed border-black/10 p-10 text-center text-sm opacity-60 dark:border-white/10">
            아직 추천 디자인이 없습니다.
          </p>
        )}
      </section>

      <section className="bg-accent-soft">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            원하는 디자인을 찾으셨나요?
          </h2>
          <p className="mx-auto mt-2 max-w-xl opacity-80">
            문의를 남겨주시면 상담을 통해 맞춤 네일아트를 안내해드립니다.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full border border-accent px-8 py-3 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
          >
            문의하기
          </Link>
        </div>
      </section>
    </div>
  );
}
