import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDesignsPage() {
  const designs = await prisma.design.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Designs</h1>
        <Link
          href="/admin/designs/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          New Design
        </Link>
      </div>

      {designs.length === 0 ? (
        <p className="text-sm opacity-70">No designs yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-black/10 dark:border-white/10">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b border-black/10 bg-accent-soft/40 dark:border-white/10">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {designs.map((design) => (
                <tr key={design.id}>
                  <td className="px-4 py-3">{design.title}</td>
                  <td className="px-4 py-3 opacity-70">{design.category}</td>
                  <td className="px-4 py-3">
                    {design.featured ? (
                      <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                        Featured
                      </span>
                    ) : (
                      <span className="opacity-40">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 opacity-70">
                    {design.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/designs/${design.id}/edit`}
                      className="text-accent hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
