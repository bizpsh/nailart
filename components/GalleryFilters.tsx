import { CATEGORIES, COLORS } from "@/lib/constants";

type GalleryFiltersProps = {
  category?: string;
  color?: string;
  q?: string;
};

export default function GalleryFilters({
  category = "",
  color = "",
  q = "",
}: GalleryFiltersProps) {
  return (
    <form
      method="GET"
      action="/gallery"
      className="mb-8 flex flex-wrap items-end gap-4 rounded-xl border border-black/10 bg-accent-soft/40 p-4 dark:border-white/10"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="category" className="text-xs font-medium opacity-70">
          카테고리
        </label>
        <select
          id="category"
          name="category"
          defaultValue={category}
          className="rounded-md border border-black/10 bg-background px-3 py-2 text-sm dark:border-white/10"
        >
          <option value="">전체</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="color" className="text-xs font-medium opacity-70">
          색상
        </label>
        <select
          id="color"
          name="color"
          defaultValue={color}
          className="rounded-md border border-black/10 bg-background px-3 py-2 text-sm dark:border-white/10"
        >
          <option value="">전체</option>
          {COLORS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-1 min-w-[160px] flex-col gap-1">
        <label htmlFor="q" className="text-xs font-medium opacity-70">
          검색
        </label>
        <input
          id="q"
          name="q"
          type="text"
          defaultValue={q}
          placeholder="제목, 설명으로 검색..."
          className="rounded-md border border-black/10 bg-background px-3 py-2 text-sm dark:border-white/10"
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        필터 적용
      </button>
    </form>
  );
}
