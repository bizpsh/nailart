import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
    </div>
  );
}
