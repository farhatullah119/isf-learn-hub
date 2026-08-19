import AdminLayout from "@/components/admin/AdminLayout";
import CrudManager, { StatusBadge } from "@/components/admin/CrudManager";
import { useCategories } from "@/hooks/use-lms";

export default function AdminLmsCourses() {
  const { data: categories = [] } = useCategories();

  return (
    <AdminLayout title="Courses" description="Create and manage learning courses">
      <CrudManager
        table="courses"
        singular="Course"
        slugFrom="title"
        relatedSelect="*, categories(name)"
        searchKeys={["title", "slug", "instructor", "summary"]}
        filters={[
          {
            key: "level",
            label: "Levels",
            options: ["Beginner", "Intermediate", "Advanced"].map((v) => ({ value: v, label: v })),
          },
        ]}
        defaults={{ level: "Beginner", language: "English", published: true }}
        columns={[
          { key: "title", label: "Title" },
          { key: "level", label: "Level", className: "hidden md:table-cell" },
          {
            key: "categories",
            label: "Category",
            sortable: false,
            className: "hidden lg:table-cell",
            render: (r) => r.categories?.name ?? "—",
          },
          { key: "published", label: "Status", render: (r) => <StatusBadge value={r.published} /> },
          {
            key: "featured",
            label: "Featured",
            className: "hidden md:table-cell",
            render: (r) => (r.featured ? "Yes" : "No"),
          },
        ]}
        fields={[
          { name: "title", label: "Title", type: "text", required: true },
          { name: "slug", label: "Slug", type: "text", half: true, help: "Leave blank to auto-generate" },
          {
            name: "category_id",
            label: "Category",
            type: "select",
            half: true,
            options: categories.map((c: any) => ({ value: c.id, label: c.name })),
          },
          { name: "summary", label: "Short summary", type: "textarea" },
          { name: "description", label: "Full description", type: "textarea" },
          {
            name: "level",
            label: "Level",
            type: "select",
            half: true,
            options: ["Beginner", "Intermediate", "Advanced"].map((v) => ({ value: v, label: v })),
          },
          { name: "duration", label: "Duration", type: "text", half: true, placeholder: "e.g. 6 weeks" },
          { name: "language", label: "Language", type: "text", half: true },
          { name: "instructor", label: "Instructor", type: "text", half: true },
          { name: "external_url", label: "External link (optional)", type: "url" },
          { name: "image_url", label: "Cover image", type: "image" },
          { name: "published", label: "Published on website", type: "switch", half: true },
          { name: "featured", label: "Featured course", type: "switch", half: true },
        ]}
      />
    </AdminLayout>
  );
}