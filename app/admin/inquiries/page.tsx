import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Inquiries</h1>

      {inquiries.length === 0 ? (
        <p className="text-sm opacity-70">No inquiries yet.</p>
      ) : (
        <ul className="space-y-4">
          {inquiries.map((inquiry) => (
            <li
              key={inquiry.id}
              className="rounded-lg border border-black/10 p-4 text-sm dark:border-white/10"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{inquiry.name}</span>
                <span className="opacity-70">{inquiry.email}</span>
                <span className="text-xs opacity-50">
                  {inquiry.createdAt.toLocaleString()}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-wrap opacity-80">
                {inquiry.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
