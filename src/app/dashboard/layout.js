import { DashboardSidebar } from "@/components/dashboard/DashboardSideber";

import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div>{children}</div>
    </div>
  );
};

export default DashboardLayout;
