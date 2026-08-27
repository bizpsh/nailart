import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [designCount, inquiryCount, recentDesigns, recentInquiries] =
    await Promise.all([
      prisma.design.count(),
      prisma.inquiry.count(),
      prisma.design.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/designs"
          className="rounded-xl border border-black/10 p-6 transition-shadow hover:shadow-md dark:border-white/10"
        >
          <p className="text-sm opacity-70">Designs</p>
          <p className="mt-2 text-3xl font-semibold">{designCount}</p>
        </Link>
        <Link
          href="/admin/inquiries"
          className="rounded-xl border border-black/10 p-6 transition-shadow hover:shadow-md dark:border-white/10"
        >
          <p className="text-sm opacity-70">Inquiries</p>
          <p className="mt-2 text-3xl font-semibold">{inquiryCount}</p>
        </Link>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">
            Recent Designs
          </h2>
          <Link
            href="/admin/designs"
            className="text-sm text-accent hover:underline"
          >
            View all
          </Link>
        </div>
        {recentDesigns.length === 0 ? (
          <p className="text-sm opacity-70">No designs yet.</p>
        ) : (
          <ul className="divide-y divide-black/10 rounded-lg border border-black/10 dark:divide-white/10 dark:border-white/10">
            {recentDesigns.map((design) => (
              <li
                key={design.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <span className="font-medium">{design.title}</span>
                <span className="opacity-70">{design.category}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">
            Recent Inquiries
          </h2>
          <Link
            href="/admin/inquiries"
            className="text-sm text-accent hover:underline"
          >
            View all
          </Link>
        </div>
        {recentInquiries.length === 0 ? (
          <p className="text-sm opacity-70">No inquiries yet.</p>
        ) : (
          <ul className="divide-y divide-black/10 rounded-lg border border-black/10 dark:divide-white/10 dark:border-white/10">
            {recentInquiries.map((inquiry) => (
              <li key={inquiry.id} className="px-4 py-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{inquiry.name}</span>
                  <span className="opacity-70">{inquiry.email}</span>
                </div>
                <p className="mt-1 line-clamp-1 opacity-70">
                  {inquiry.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
