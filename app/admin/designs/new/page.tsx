import DesignForm from "@/components/admin/DesignForm";

export default function NewDesignPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">New Design</h1>
      <DesignForm mode="create" />
    </div>
  );
}
