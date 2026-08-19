import AdminLayout from "@/components/admin/AdminLayout";
import CrudManager, { StatusBadge } from "@/components/admin/CrudManager";
import { useCategories } from "@/hooks/use-lms";

const types = ["link", "pdf", "video", "template", "guide"];

export default function AdminResourcesManager() {
  const { data: categories = [] } = useCategories();

  return (
    <AdminLayout title="Learning Resources" description="Downloadable and linked study material">
      <CrudManager
        table="learning_resources"
        singular="Resource"
        relatedSelect="*, categories(name)"
        searchKeys={["title", "description"]}
        filters={[{ key: "resource_type", label: "Types", options: types.map((t) => ({ value: t, label: t })) }]}
        defaults={{ published: true, resource_type: "link" }}
        columns={[
          { key: "title", label: "Title" },
          { key: "resource_type", label: "Type", className: "hidden md:table-cell" },
          {
            key: "categories",
            label: "Category",
            sortable: false,
            className: "hidden lg:table-cell",
            render: (r) => r.categories?.name ?? "—",
          },
          { key: "published", label: "Status", render: (r) => <StatusBadge value={r.published} /> },
        ]}
        fields={[
          { name: "title", label: "Title", type: "text", required: true },
          {
            name: "resource_type",
            label: "Type",
            type: "select",
            half: true,
            options: types.map((t) => ({ value: t, label: t })),
          },
          {
            name: "category_id",
            label: "Category",
            type: "select",
            half: true,
            options: categories.map((c: any) => ({ value: c.id, label: c.name })),
          },
          { name: "description", label: "Description", type: "textarea" },
          { name: "link_url", label: "External link", type: "url", half: true },
          { name: "file_url", label: "File URL", type: "url", half: true },
          { name: "published", label: "Published on website", type: "switch" },
        ]}
      />
    </AdminLayout>
  );
}