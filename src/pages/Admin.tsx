import AdminLayout from "@/components/admin/AdminLayout";
import DashboardOverview from "@/components/admin/DashboardOverview";
import OpportunityTable from "@/components/admin/OpportunityTable";

const Admin = () => {
  return (
    <AdminLayout title="Dashboard" description="Overview of all content">
      <div className="space-y-8">
        <DashboardOverview />
        <OpportunityTable title="All Posts" />
      </div>
    </AdminLayout>
  );
};

export default Admin;
