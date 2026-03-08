import AdminLayout from "@/components/admin/AdminLayout";
import OpportunityTable from "@/components/admin/OpportunityTable";

export default function AdminInternships() {
  return (
    <AdminLayout title="Internships" description="Manage internship listings">
      <OpportunityTable category="internship" title="Internship Posts" />
    </AdminLayout>
  );
}
