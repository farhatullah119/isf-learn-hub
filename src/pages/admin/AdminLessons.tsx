import AdminLayout from "@/components/admin/AdminLayout";
import CrudManager, { StatusBadge } from "@/components/admin/CrudManager";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function AdminLessons() {
  const { data: courses = [] } = useQuery({
    queryKey: ["course-options"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("courses").select("id, title").order("title");
      if (error) throw error;
      return data as any[];
    },
  });

  return (
    <AdminLayout title="Lessons" description="Manage lessons inside each course">
      <CrudManager
        table="lessons"
        singular="Lesson"
        relatedSelect="*, courses(title)"
        searchKeys={["title", "summary"]}
        defaults={{ published: true, order_index: 1 }}
        defaultSort={{ key: "order_index", asc: true }}
        columns={[
          { key: "order_index", label: "#", className: "w-12" },
          { key: "title", label: "Title" },
          {
            key: "courses",
            label: "Course",
            sortable: false,
            className: "hidden md:table-cell",
            render: (r) => r.courses?.title ?? "—",
          },
          { key: "duration", label: "Duration", className: "hidden lg:table-cell" },
          { key: "published", label: "Status", render: (r) => <StatusBadge value={r.published} /> },
        ]}
        fields={[
          { name: "title", label: "Title", type: "text", required: true },
          {
            name: "course_id",
            label: "Course",
            type: "select",
            half: true,
            options: courses.map((c: any) => ({ value: c.id, label: c.title })),
          },
          { name: "order_index", label: "Order", type: "number", half: true },
          { name: "summary", label: "Summary", type: "textarea" },
          { name: "content", label: "Lesson content", type: "textarea" },
          { name: "video_url", label: "Video link", type: "url", half: true },
          { name: "duration", label: "Duration", type: "text", half: true, placeholder: "e.g. 20 min" },
          { name: "published", label: "Published on website", type: "switch" },
        ]}
      />
    </AdminLayout>
  );
}