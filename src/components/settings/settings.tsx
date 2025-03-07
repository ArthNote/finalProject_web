"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserIcon,
  PaintbrushIcon,
  CreditCardIcon,
  BellIcon,
  CogIcon,
} from "lucide-react";
import AppearanceTab from "./appearance";
import AccountTab from "./account";
import NotificationsTab from "./notifications";
import MyPlanTab from "./myplan";
import { useTranslations } from "next-intl";
import PrefrencesTab from "./prefrences";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "account";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Card className="overflow-hidden border md:rounded-lg">
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <div className="flex flex-col md:grid md:grid-cols-[240px_1fr] md:min-h-[600px]">
          {/* Mobile Select Navigation */}
          <div className="p-4 md:hidden border-b bg-background">
            <Select value={currentTab} onValueChange={handleTabChange}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const items = [
                        { value: "account", label: "Account", icon: UserIcon },
                        {
                          value: "appearance",
                          label: "Appearance",
                          icon: PaintbrushIcon,
                        },
                        {
                          value: "myplan",
                          label: "My Plan",
                          icon: CreditCardIcon,
                        },
                        {
                          value: "notifications",
                          label: "Notifications",
                          icon: BellIcon,
                        },
                        {
                          value: "prefrences",
                          label: "Preferences",
                          icon: CogIcon,
                        },
                      ];
                      const currentItem = items.find(
                        (item) => item.value === currentTab
                      );
                      if (currentItem) {
                        const Icon = currentItem.icon;
                        return (
                          <>
                            <Icon className="h-4 w-4" />
                            <span>{currentItem.label}</span>
                          </>
                        );
                      }
                    })()}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {[
                  { value: "account", label: "Account", icon: UserIcon },
                  {
                    value: "appearance",
                    label: "Appearance",
                    icon: PaintbrushIcon,
                  },
                  { value: "myplan", label: "My Plan", icon: CreditCardIcon },
                  {
                    value: "notifications",
                    label: "Notifications",
                    icon: BellIcon,
                  },
                  { value: "prefrences", label: "Preferences", icon: CogIcon },
                ].map(({ value, label, icon: Icon }) => (
                  <SelectItem key={value} value={value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <aside className="hidden md:block shrink-0 border-b md:border-b-0 md:border-r border-border bg-muted/10">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b bg-background">
                <h1 className="text-lg font-medium tracking-tight">
                  {t("title")}
                </h1>
              </div>
              <TabsList className="flex flex-col items-stretch justify-start rounded-none border-0 bg-transparent p-1.5">
                {[
                  { value: "account", label: "Account", icon: UserIcon },
                  {
                    value: "appearance",
                    label: "Appearance",
                    icon: PaintbrushIcon,
                  },
                  { value: "myplan", label: "My Plan", icon: CreditCardIcon },
                  {
                    value: "notifications",
                    label: "Notifications",
                    icon: BellIcon,
                  },
                  {
                    value: "prefrences",
                    label: "Preferences",
                    icon: CogIcon,
                  },
                ].map(({ value, label, icon: Icon }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="group flex items-center justify-start gap-3 rounded-sm px-4 py-2.5 text-sm font-normal transition-colors hover:bg-accent/40 data-[state=active]:bg-primary/10 data-[state=active]:text-primary [&:not(:first-child)]:mt-0.5"
                  >
                    <Icon className="h-4 w-4 shrink-0 opacity-70 group-data-[state=active]:opacity-100" />
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </aside>

          <main className="flex-1 bg-background">
            <div className="flex-1 space-y-8 pr-6 pl-6 pt-6">
              <TabsContent value="account" className="mt-0 border-0 p-0">
                <AccountTab />
              </TabsContent>

              <TabsContent value="appearance" className="mt-0 border-0 p-0">
                <AppearanceTab />
              </TabsContent>

              <TabsContent value="myplan" className="mt-0 border-0 p-0">
                <MyPlanTab />
              </TabsContent>

              <TabsContent value="notifications" className="mt-0 border-0 p-0">
                <NotificationsTab />
              </TabsContent>

              <TabsContent value="prefrences" className="mt-0 border-0 p-0">
                <PrefrencesTab />
              </TabsContent>
            </div>
          </main>
        </div>
      </Tabs>
    </Card>
  );
}
