import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BellRing, Bell, BellOff, Clock, Filter } from "lucide-react";

export default function NotificationsTab() {
  const t = useTranslations("settings.notifications");
  const { toast } = useToast();

  // Handlers would be connected to backend in production
  const handleToggleChange = () => {
    toast({
      title: t("toast.success.title"),
      description: t("toast.success.description"),
    });
  };

  return (
    <div className="py-8 px-10">
      <div className="grid gap-12">
        {/* Main Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-medium">{t("title")}</h2>
            <p className="text-muted-foreground mt-2">{t("description")}</p>
          </div>

          {/* Notification Preferences */}
          <div className="space-y-6 rounded-lg bg-muted/40 p-6">
            <h3 className="text-xl font-medium">{t("preferences.title")}</h3>
            <div className="space-y-6">
              <div className="group hover:bg-background rounded-lg p-4 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-lg">{t("preferences.email")}</Label>
                    <p className="text-muted-foreground">
                      {t("preferences.emailDescription")}
                    </p>
                  </div>
                  <Switch onCheckedChange={handleToggleChange} />
                </div>
              </div>
              <div className="group hover:bg-background rounded-lg p-4 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-lg">{t("preferences.push")}</Label>
                    <p className="text-muted-foreground">
                      {t("preferences.pushDescription")}
                    </p>
                  </div>
                  <Switch onCheckedChange={handleToggleChange} />
                </div>
              </div>
              <div className="group hover:bg-background rounded-lg p-4 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-lg">{t("preferences.inApp")}</Label>
                    <p className="text-muted-foreground">
                      {t("preferences.inAppDescription")}
                    </p>
                  </div>
                  <Switch onCheckedChange={handleToggleChange} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="space-y-6">
          <h2 className="text-2xl font-medium">{t("categories.title")}</h2>
          <div className="rounded-lg bg-muted/40 p-6 space-y-6">
            {[
              {
                key: "tasks",
                label: t("categories.tasks"),
                description: t("categories.tasksDescription"),
                icon: BellRing,
              },
              {
                key: "mentions",
                label: t("categories.mentions"),
                description: t("categories.mentionsDescription"),
                icon: Bell,
              },
              {
                key: "team",
                label: t("categories.team"),
                description: t("categories.teamDescription"),
                icon: Bell,
              },
            ].map(({ key, label, description, icon: Icon }) => (
              <div key={key} className="group hover:bg-background rounded-lg p-4 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-lg">{label}</Label>
                      <p className="text-muted-foreground">{description}</p>
                    </div>
                  </div>
                  <Switch onCheckedChange={handleToggleChange} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Do Not Disturb */}
        <section className="space-y-6">
          <h2 className="text-2xl font-medium">{t("dnd.title")}</h2>
          <div className="rounded-lg bg-muted/40 p-6 space-y-8">
            <div className="group hover:bg-background rounded-lg p-4 transition-colors">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-lg">{t("dnd.title")}</Label>
                  <p className="text-muted-foreground">
                    {t("dnd.description")}
                  </p>
                </div>
                <Switch onCheckedChange={handleToggleChange} />
              </div>
            </div>
            <div className="space-y-4 px-4">
              <Label className="text-lg">{t("dnd.temporary")}</Label>
              <Select
                onValueChange={(value) => {
                  toast({
                    title: t("toast.mute.title"),
                    description: t("toast.mute.description"),
                  });
                }}
              >
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder={t("dnd.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">{t("dnd.options.1h")}</SelectItem>
                  <SelectItem value="4h">{t("dnd.options.4h")}</SelectItem>
                  <SelectItem value="8h">{t("dnd.options.8h")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
