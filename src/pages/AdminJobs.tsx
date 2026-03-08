import AdminLayout from "@/components/admin/AdminLayout";
import OpportunityTable from "@/components/admin/OpportunityTable";

export default function AdminJobs() {
  return (
    <AdminLayout title="Jobs" description="Manage job announcements">
      <OpportunityTable category="job" title="Job Posts" />
    </AdminLayout>
  );
}
