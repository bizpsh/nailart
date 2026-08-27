import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DesignForm from "@/components/admin/DesignForm";

export default async function EditDesignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const design = await prisma.design.findUnique({ where: { id } });

  if (!design) {
    notFound();
  }

  const colors = design.colors
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit Design</h1>
      <DesignForm mode="edit" design={{ ...design, colors }} />
    </div>
  );
}
