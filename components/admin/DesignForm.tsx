"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, COLORS } from "@/lib/constants";

type DesignData = {
  id: string;
  title: string;
  description: string;
  category: string;
  colors: string[];
  imageUrl: string;
  featured: boolean;
};

type DesignFormProps =
  | { mode: "create"; design?: undefined }
  | { mode: "edit"; design: DesignData };

export default function DesignForm({ mode, design }: DesignFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(design?.title ?? "");
  const [description, setDescription] = useState(design?.description ?? "");
  const [category, setCategory] = useState<string>(
    design?.category ?? CATEGORIES[0]
  );
  const [colors, setColors] = useState<string[]>(design?.colors ?? []);
  const [featured, setFeatured] = useState(design?.featured ?? false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    design?.imageUrl ?? null
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function toggleColor(color: string) {
    setColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    if (selected) {
      setPreviewUrl(URL.createObjectURL(selected));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (colors.length === 0) {
      setError("색상을 1개 이상 선택해주세요.");
      return;
    }

    if (mode === "create" && !file) {
      setError("이미지를 업로드해주세요.");
      return;
    }

    setSubmitting(true);

    try {
      let imageUrl = design?.imageUrl ?? "";

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) {
          const data = await uploadRes.json().catch(() => ({}));
          throw new Error(data.error ?? "이미지 업로드에 실패했습니다.");
        }
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      const body = {
        title,
        description,
        category,
        colors,
        imageUrl,
        featured,
      };

      const res = await fetch(
        mode === "create" ? "/api/designs" : `/api/designs/${design!.id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "저장에 실패했습니다.");
      }

      router.push("/admin/designs");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!design) return;
    if (!window.confirm("이 디자인을 삭제하시겠습니까?")) return;

    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/designs/${design.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "삭제에 실패했습니다.");
      }

      router.push("/admin/designs");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제에 실패했습니다.");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="space-y-1">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-white/10"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-white/10"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="category" className="text-sm font-medium">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-white/10"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Colors</legend>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => {
            const checked = colors.includes(color);
            return (
              <label
                key={color}
                className={`cursor-pointer rounded-full border px-3 py-1 text-xs transition-colors ${
                  checked
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-black/10 opacity-70 dark:border-white/10"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleColor(color)}
                  className="sr-only"
                />
                {color}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="space-y-1">
        <label htmlFor="image" className="text-sm font-medium">
          Image
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm"
        />
        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Preview"
            className="mt-2 h-40 w-40 rounded-md border border-black/10 object-cover dark:border-white/10"
          />
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="featured"
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="featured" className="text-sm font-medium">
          Featured
        </label>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting || deleting}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Saving..." : mode === "create" ? "Create" : "Save"}
        </button>
        {mode === "edit" && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={submitting || deleting}
            className="rounded-md border border-red-500/40 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10 disabled:opacity-50 dark:text-red-400"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
    </form>
  );
}
