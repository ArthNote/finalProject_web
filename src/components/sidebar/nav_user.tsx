"use client";

import {
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Settings,
  User,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLocale, useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/hooks/use-toast";
import { Link, redirect, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useSocket } from "@/contexts/SocketContext";
import { useUnlockedThemes } from "@/hooks/use-unlocked-themes";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { theme, setTheme } = useTheme();
  const { isMobile } = useSidebar();
  const unlockedThemes = useUnlockedThemes();
  const isCustomTheme = theme?.startsWith("theme-");
  const t = useTranslations("nav");
  const router = useRouter();
  const locale = useLocale() as "en" | "fr";
  const { socket } = useSocket();

  const [selectedMode, setSelectedMode] = useState<"light" | "dark" | "system">(
    theme === "system"
      ? "system"
      : document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
  );

  const signout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onRequest: () => {
          if (socket) {
            socket.disconnect();
          }
          toast({
            title: t("user.toast.signout.loading.title"),
            description: t("user.toast.signout.loading.description"),
          });
        },
        onSuccess: () => {
          toast({
            title: t("user.toast.signout.success.title"),
            description: t("user.toast.signout.success.description"),
          });
          router.refresh();
          // redirect({
          //   href: "/signin",
          //   locale: locale,
          // });
        },
      },
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/settings?tab=account">
                <DropdownMenuItem>
                  <User />
                  {t("user.account")}
                </DropdownMenuItem>
              </Link>
              <Link href="/settings?tab=myplan">
                <DropdownMenuItem>
                  <CreditCard />
                  {t("user.plan")}
                </DropdownMenuItem>
              </Link>
              <Link href="/settings?tab=prefrences">
                <DropdownMenuItem>
                  <Settings />
                  {t("user.prefrences")}
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <div className="p-0.5">
                <div className="relative flex h-6 items-center rounded-md bg-black/5 ring-1 ring-black/[0.03] dark:bg-white/5 dark:ring-white/[0.05]">
                  <div
                    className="absolute left-0 h-5 w-[32.5%] rounded-[4px] bg-gradient-to-b from-white/80 to-white/50 shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.45,0.25,0.25,1)] dark:from-zinc-950/90 dark:to-zinc-950/70"
                    style={{
                      transform: `translateX(${
                        selectedMode === "system"
                          ? "204%"
                          : selectedMode === "dark"
                          ? "102%"
                          : "2%"
                      })`,
                    }}
                  />
                  {[
                    { value: "light", icon: Sun },
                    { value: "dark", icon: Moon },
                    { value: "system", icon: Monitor },
                  ].map(({ value, icon: Icon }) => {
                    const modeValue = value as "light" | "dark" | "system";

                    return (
                      <button
                        key={value}
                        onClick={() => {
                          // First update the visual selection
                          setSelectedMode(modeValue);

                          const isCustomTheme = theme?.startsWith("theme-");
                          if (isCustomTheme) {
                            const currentThemeName = theme?.replace(
                              "theme-",
                              ""
                            );
                            const hasTheme = unlockedThemes?.some(
                              (t) =>
                                t.reward.title
                                  .toLowerCase()
                                  .replace(/_/g, "-") === currentThemeName
                            );

                            if (hasTheme) {
                              const customThemeName = `theme-${currentThemeName}`;
                              if (modeValue === "system") {
                                // Store current theme before switching to system
                                localStorage.setItem(
                                  "lastCustomTheme",
                                  customThemeName
                                );

                                // Apply system preference for dark/light mode
                                const prefersDark = window.matchMedia(
                                  "(prefers-color-scheme: dark)"
                                ).matches;
                                document.documentElement.classList.toggle(
                                  "dark",
                                  prefersDark
                                );

                                // Important: Keep using the custom theme, just toggle dark/light based on system
                                // Instead of switching to system theme, we keep the custom theme with system mode
                                setSelectedMode("system"); // This updates the UI indicator

                                // We're not setting the theme to "system" - we keep the custom theme
                                // This is key to preserving the custom theme while in system mode
                                return;
                              } else {
                                // For light/dark mode, apply the mode then the custom theme
                                const root = document.documentElement;
                                if (modeValue === "dark") {
                                  root.classList.add("dark");
                                } else {
                                  root.classList.remove("dark");
                                }
                                setTheme(customThemeName);
                              }
                              return;
                            }
                          } else if (modeValue === "system") {
                            // When switching to system, check for last custom theme
                            const lastCustomTheme =
                              localStorage.getItem("lastCustomTheme");
                            if (lastCustomTheme) {
                              // Apply system preference first
                              const prefersDark = window.matchMedia(
                                "(prefers-color-scheme: dark)"
                              ).matches;
                              document.documentElement.classList.toggle(
                                "dark",
                                prefersDark
                              );
                              setTheme("system");
                              return;
                            }
                          }

                          // Default behavior
                          setTheme(modeValue);
                        }}
                        className={cn(
                          "relative z-20 flex w-1/3 items-center justify-center py-1 transition-colors duration-200",
                          selectedMode === modeValue
                            ? "text-foreground"
                            : "text-muted-foreground/70 hover:text-foreground/80"
                        )}
                      >
                        <Icon className="h-3 w-3 transition-all duration-300" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signout}>
              <LogOut />
              {t("user.signout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
