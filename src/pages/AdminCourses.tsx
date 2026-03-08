import AdminLayout from "@/components/admin/AdminLayout";
import OpportunityTable from "@/components/admin/OpportunityTable";

export default function AdminCourses() {
  return (
    <AdminLayout title="Courses" description="Manage free course listings">
      <OpportunityTable category="course" title="Course Posts" />
    </AdminLayout>
  );
}
