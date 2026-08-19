import AdminLayout from "@/components/admin/AdminLayout";
import CrudManager from "@/components/admin/CrudManager";

export default function AdminCategories() {
  return (
    <AdminLayout title="Categories" description="Group courses and resources">
      <CrudManager
        table="categories"
        singular="Category"
        slugFrom="name"
        searchKeys={["name", "slug", "description"]}
        columns={[
          { key: "name", label: "Name" },
          { key: "slug", label: "Slug", className: "hidden md:table-cell" },
          { key: "description", label: "Description", className: "hidden lg:table-cell" },
        ]}
        fields={[
          { name: "name", label: "Name", type: "text", required: true, half: true },
          { name: "slug", label: "Slug", type: "text", half: true, help: "Leave blank to auto-generate" },
          { name: "description", label: "Description", type: "textarea" },
        ]}
      />
    </AdminLayout>
  );
}