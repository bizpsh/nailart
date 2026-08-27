import Link from "next/link";

type DesignCardProps = {
  slug: string;
  title: string;
  category: string;
  colors: string | string[];
  imageUrl: string;
};

export default function DesignCard({
  slug,
  title,
  category,
  colors,
  imageUrl,
}: DesignCardProps) {
  const colorList = Array.isArray(colors)
    ? colors
    : colors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

  return (
    <Link
      href={`/gallery/${slug}`}
      className="group block overflow-hidden rounded-xl border border-black/10 bg-background transition-shadow hover:shadow-lg dark:border-white/10"
    >
      <div className="aspect-square w-full overflow-hidden bg-accent-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="space-y-2 p-4">
        <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
          {category}
        </span>
        <h3 className="font-semibold tracking-tight">{title}</h3>
        {colorList.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {colorList.map((color) => (
              <span
                key={color}
                className="rounded-full border border-black/10 px-2 py-0.5 text-xs opacity-70 dark:border-white/10"
              >
                {color}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
