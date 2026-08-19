import AdminLayout from "@/components/admin/AdminLayout";
import CrudManager from "@/components/admin/CrudManager";
import { Badge } from "@/components/ui/badge";

const statuses = ["new", "read", "replied", "archived"];

export default function AdminMessages() {
  return (
    <AdminLayout title="Messages" description="Contact form submissions">
      <CrudManager
        table="contact_messages"
        singular="Message"
        searchKeys={["name", "email", "subject", "message"]}
        filters={[{ key: "status", label: "Statuses", options: statuses.map((s) => ({ value: s, label: s })) }]}
        defaults={{ status: "new" }}
        columns={[
          { key: "name", label: "From" },
          { key: "email", label: "Email", className: "hidden md:table-cell" },
          { key: "subject", label: "Subject", className: "hidden lg:table-cell" },
          {
            key: "status",
            label: "Status",
            render: (r) => (
              <Badge variant={r.status === "new" ? "default" : "secondary"}>{r.status}</Badge>
            ),
          },
        ]}
        fields={[
          { name: "name", label: "Name", type: "text", half: true },
          { name: "email", label: "Email", type: "text", half: true },
          { name: "subject", label: "Subject", type: "text" },
          { name: "message", label: "Message", type: "textarea" },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: statuses.map((s) => ({ value: s, label: s })),
          },
        ]}
      />
    </AdminLayout>
  );
}