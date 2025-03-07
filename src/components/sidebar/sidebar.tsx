"use client";

import * as React from "react";
import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";
import { NavMain } from "./nav_main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav_user";
import { type NavItem } from "@/types/navigation";
import { WorkspaceSwitcher } from "./workspace_switcher";
import { authClient } from "@/lib/auth-client";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navItems: NavItem[];
}

export function AppSidebar({ navItems, ...props }: AppSidebarProps) {
  //   const { data: session } = authClient.useSession();

  const { data: session } = authClient.useSession();

  const userData = {
    name: session?.user.username || session?.user.name || "John data",
    email: session?.user.email || "johndoe@gmail.com",
    avatar: session?.user.image || "https://github.com/shadcn.png",
  };

  const teams = [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher teams={teams} />
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
