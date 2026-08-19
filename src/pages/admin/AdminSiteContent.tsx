import AdminLayout from "@/components/admin/AdminLayout";
import CrudManager from "@/components/admin/CrudManager";

export default function AdminSiteContent() {
  return (
    <AdminLayout title="Website Content" description="Edit text shown on the public pages">
      <CrudManager
        table="site_content"
        singular="Content block"
        searchKeys={["key", "label", "value"]}
        columns={[
          { key: "label", label: "Label" },
          { key: "key", label: "Key", className: "hidden md:table-cell" },
          {
            key: "value",
            label: "Value",
            className: "hidden lg:table-cell max-w-md",
            render: (r) => <span className="line-clamp-2">{r.value}</span>,
          },
        ]}
        fields={[
          { name: "key", label: "Key", type: "text", required: true, half: true, help: "e.g. home_hero_title" },
          { name: "label", label: "Label", type: "text", half: true },
          { name: "value", label: "Value", type: "textarea", required: true },
        ]}
      />
    </AdminLayout>
  );
}