"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutSideContentLeft,
  Bell,
  House,
  Magnifier,
} from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";

export function DashboardSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const clientMenu = [
    {
      icon: House,
      label: "Hiring History",
      href: "/dashboard/client/hiring-history",
    },
    {
      icon: Magnifier,
      label: "Update Profile",
      href: "/dashboard/client/update-profile",
    },
    {
      icon: Bell,
      label: "Comments",
      href: "/dashboard/client/comments",
    },
  ];

  const lawyersMenu = [
    {
      icon: House,
      label: "Hiring History",
      href: "/dashboard/lawyer/hiring-history",
    },
    {
      icon: Magnifier,
      label: "Manage-Legal-Profile",
      href: "/dashboard/lawyer/manage-legal-profile",
    },
  ];

  const adminMenu = [
    {
      icon: House,
      label: "Manage-Users ",
      href: "/dashboard/admin/manage-users",
    },
    {
      icon: Magnifier,
      label: "All-Transactions",
      href: "/dashboard/admin/all-transactions",
    },
    {
      icon: Magnifier,
      label: "Analytics",
      href: "/dashboard/admin/analytics",
    },
  ];

  const role = session?.user?.role;

  let menuItems = [];

  if (role === "client") {
    menuItems = clientMenu;
  } else if (role === "lawyer") {
    menuItems = lawyersMenu;
  } else if (role === "admin") {
    menuItems = adminMenu;
  }

  const navContent = (
    <nav className="flex flex-col gap-2">
      {menuItems?.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
              isActive
                ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 shadow-lg"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <item.icon className="size-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* User Profile */}
      <div className="px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-500/60 shrink-0">
            {/* <Image
              width={40}
              height={40}
              src={
                session?.user?.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent("Jane Doe")}&background=7c3aed&color=fff&bold=true`
              }
              alt="Avatar"
              className="object-cover w-full h-full"
            /> */}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-sm font-bold truncate leading-tight">
              {session?.user?.name}
            </p>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${role === "admin" ? "text-yellow-400" : role === "organizer" ? "text-indigo-400" : "text-pink-400"}`}
            >
              {role}
            </span>
          </div>
        </div>
      </div>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-950 p-4 lg:block">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      <Drawer>
        <Button className="lg:hidden" variant="secondary">
          <LayoutSideContentLeft />
          Menu
        </Button>

        <Drawer.Backdrop>
          <Drawer.Content placement="left">
            <Drawer.Dialog>
              <Drawer.CloseTrigger />

              <Drawer.Header>
                <Drawer.Heading>Navigation</Drawer.Heading>
              </Drawer.Header>

              <Drawer.Body>{navContent}</Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
}
