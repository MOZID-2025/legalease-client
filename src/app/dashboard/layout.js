import { DashboardSidebar } from "@/components/dashboard/DashboardSideber";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <DashboardSidebar />

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
