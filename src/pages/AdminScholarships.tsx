import AdminLayout from "@/components/admin/AdminLayout";
import OpportunityTable from "@/components/admin/OpportunityTable";

export default function AdminScholarships() {
  return (
    <AdminLayout title="Scholarships" description="Manage scholarship listings">
      <OpportunityTable category="scholarship" title="Scholarship Posts" />
    </AdminLayout>
  );
}
