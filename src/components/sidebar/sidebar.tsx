"use client";

import * as React from "react";
import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";
import { NavMain } from "./nav_main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav_user";
import { type NavItem } from "@/types/navigation";
import { WorkspaceSwitcher } from "./workspace_switcher";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";
import lightLogo from "../../../public/lightLogo.svg";
import darkLogo from "../../../public/darkLogo.svg";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { consts } from "@/lib/constants";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navItems: NavItem[];
}

export function AppSidebar({ navItems, ...props }: AppSidebarProps) {
  //   const { data: session } = authClient.useSession();
  const { resolvedTheme } = useTheme();
  const { state } = useSidebar();
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

  const logoSrc = resolvedTheme === "dark" ? darkLogo : lightLogo;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/dashboard" className="group/logo">
              <SidebarMenuButton
                size="lg"
                className={`flex items-center ${
                  state === "collapsed" ? "justify-center" : "justify-start"
                } gap-2 py-2`}
              >
                <div className="flex items-center justify-center">
                  <Image
                    src={logoSrc}
                    width={40}
                    height={40}
                    alt="App Logo"
                    className="object-contain group-hover/logo:-rotate-12 transition-all duration-300"
                  />
                </div>
                <h1
                  className={`text-lg font-medium ${
                    state === "collapsed" && "hidden"
                  } group-hover/logo:translate-x-0.5 transition-all duration-300`}
                >
                  {consts.appName}.
                </h1>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
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
