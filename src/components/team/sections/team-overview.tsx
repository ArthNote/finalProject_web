"use client";

import { useTeam } from "../team-context";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Users, HardDrive } from "lucide-react";
import { useTranslations } from "next-intl";

const TeamOverview = () => {
  const { team } = useTeam();
  const t = useTranslations("team.overview.overview");

  const seatsPercentage =
    (team.subscription.seats.used / team.subscription.seats.total) * 100;

  // Convert bytes to GB for calculation
  const usedStorageGB = team.storage.used / (1024 * 1024 * 1024);
  const totalStorageGB = team.storage.total;
  const storagePercentage = (usedStorageGB / totalStorageGB) * 100;

  // Format storage display
  const formatStorage = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardDescription>{t("currentPlan")}</CardDescription>
              <h3 className="text-2xl font-bold">
                {team.subscription.plan.name}
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {team.subscription.plan.status === "trialing"
                ? t("trial")
                : team.subscription.plan.status === "active"
                ? t("active")
                : t("cancelled")}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Seats Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{t("teamSeats")}</span>
              </div>
              <span className="text-muted-foreground">
                {t("seatUsage", {
                  count: team.subscription.seats.used,
                  total: team.subscription.seats.total,
                })}
              </span>
            </div>
            <Progress value={seatsPercentage} className="h-2" />
          </div>

          {/* Storage Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <span>{t("storage")}</span>
              </div>
              <span className="text-muted-foreground">
                {t("storageUsage", {
                  count: formatStorage(team.storage.used),
                  total: `${team.storage.total} GB`,
                })}
              </span>
            </div>
            <Progress value={storagePercentage} className="h-2" />
          </div>

          {/* Renewal Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t">
            <CalendarDays className="h-4 w-4" />
            <span>
              {t("renewsOn", {
                date: new Date(
                  team.subscription.plan.renewalDate
                ).toLocaleDateString(),
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamOverview;
