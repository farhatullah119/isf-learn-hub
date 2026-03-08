import AdminLayout from "@/components/admin/AdminLayout";
import OpportunityTable from "@/components/admin/OpportunityTable";

export default function AdminWebinars() {
  return (
    <AdminLayout title="Webinars" description="Manage webinar events">
      <OpportunityTable category="webinar" title="Webinar Posts" />
    </AdminLayout>
  );
}
