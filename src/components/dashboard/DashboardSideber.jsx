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

export function DashboardSidebar() {
  const pathname = usePathname();

  const navItems = [
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

  const navContent = (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all
              ${
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
