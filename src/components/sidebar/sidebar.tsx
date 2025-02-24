"use client";

import * as React from "react";
import { CompassIcon, Computer } from "lucide-react";
import { NavMain } from "./nav_main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav_user";
import { consts } from "@/lib/constants";
import { type NavItem } from "@/types/navigation";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navItems: NavItem[];
}

export function AppSidebar({ navItems, ...props }: AppSidebarProps) {
  const { state } = useSidebar();
  //   const { data: session } = authClient.useSession();

  const userData = {
    name: "John data",
    email: "johndoe@gmail.com",
    avatar: "https://github.com/shadcn.png",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center gap-2 p-4">
        {state === "collapsed" ? (
          <Computer aria-hidden="true" className="text-primary" />
        ) : (
          <div className="flex items-center gap-2 transition-[opacity,transform] duration-200">
            <Computer aria-hidden="true" className="text-primary" />
            <h1 className="text-md font-medium whitespace-nowrap">
              {consts.appName}.
            </h1>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
