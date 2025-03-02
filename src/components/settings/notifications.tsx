import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
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
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium tracking-tight">{t("title")}</h2>
        <p className="text-sm text-muted-foreground mt-2">{t("description")}</p>
      </div>

      {/* Notification Preferences */}
      <div className="space-y-6">
        <h3 className="text-base font-medium">{t("preferences.title")}</h3>
        <div className="space-y-4 pl-1">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t("preferences.email")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("preferences.emailDescription")}
              </p>
            </div>
            <Switch onCheckedChange={handleToggleChange} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t("preferences.push")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("preferences.pushDescription")}
              </p>
            </div>
            <Switch onCheckedChange={handleToggleChange} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t("preferences.inApp")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("preferences.inAppDescription")}
              </p>
            </div>
            <Switch onCheckedChange={handleToggleChange} />
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Categories */}
      <div className="space-y-6">
        <h3 className="text-base font-medium">{t("categories.title")}</h3>
        <div className="space-y-4 pl-1">
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
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-0.5">
                  <Label>{label}</Label>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
              <Switch onCheckedChange={handleToggleChange} />
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Do Not Disturb */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-medium">{t("dnd.title")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("dnd.description")}
            </p>
          </div>
          <Switch onCheckedChange={handleToggleChange} />
        </div>
        <div className="space-y-2 pl-1 mt-4">
          <Label>{t("dnd.temporary")}</Label>
          <Select
            onValueChange={(value) => {
              toast({
                title: t("toast.mute.title"),
                description: t("toast.mute.description"),
              });
            }}
          >
            <SelectTrigger>
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
    </div>
  );
}
