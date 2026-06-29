"use-client"
import { DashboardSidebar } from "@/components/dashboard/DashboardSideber";
import Logo from "@/components/Logo";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <aside className="w-64 h-screen border-r border-white/5">
        <div className="px-6 py-4 border-b border-white/5">
          <Logo />
        </div>
        <DashboardSidebar />
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
