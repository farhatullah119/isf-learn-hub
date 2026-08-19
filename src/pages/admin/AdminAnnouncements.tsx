import AdminLayout from "@/components/admin/AdminLayout";
import CrudManager, { StatusBadge } from "@/components/admin/CrudManager";

export default function AdminAnnouncements() {
  return (
    <AdminLayout title="Announcements" description="Publish news and notices">
      <CrudManager
        table="announcements"
        singular="Announcement"
        searchKeys={["title", "body"]}
        filters={[
          {
            key: "importance",
            label: "Priority",
            options: ["normal", "important", "urgent"].map((v) => ({ value: v, label: v })),
          },
        ]}
        defaults={{ published: true, importance: "normal" }}
        columns={[
          { key: "title", label: "Title" },
          { key: "importance", label: "Priority", className: "hidden md:table-cell" },
          { key: "pinned", label: "Pinned", className: "hidden md:table-cell", render: (r) => (r.pinned ? "Yes" : "No") },
          { key: "published", label: "Status", render: (r) => <StatusBadge value={r.published} /> },
        ]}
        fields={[
          { name: "title", label: "Title", type: "text", required: true },
          { name: "body", label: "Message", type: "textarea", required: true },
          {
            name: "importance",
            label: "Priority",
            type: "select",
            half: true,
            options: ["normal", "important", "urgent"].map((v) => ({ value: v, label: v })),
          },
          { name: "pinned", label: "Pin to top", type: "switch", half: true },
          { name: "published", label: "Published on website", type: "switch" },
        ]}
      />
    </AdminLayout>
  );
}