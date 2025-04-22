"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquare, CheckCircle2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { useTeam } from "../team-context";
import { teamActivity } from "@/types/team";
import { PersonIcon } from "@radix-ui/react-icons";
import { useLocale, useTranslations } from "next-intl";
import { enUS, fr } from "date-fns/locale";

interface TeamActivityProps {
  limit?: number;
  compact?: boolean;
  showHeader?: boolean;
}

const getActivityIcon = (type: teamActivity["type"]) => {
  switch (type) {
    case "resource":
      return <FileText className="h-4 w-4" />;
    case "member":
      return <PersonIcon className="h-4 w-4" />;
    case "task":
      return <CheckCircle2 className="h-4 w-4" />;
    case "team":
      return <MessageSquare className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const ActivityItem = ({ activity }: { activity: teamActivity }) => {
  const t = useTranslations("team.overview.activity");
  const locale = useLocale() as "fr" | "en";
  return (
    <div className="flex items-center gap-3 py-3 w-full">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={activity.user.avatar || ""} />
        <AvatarFallback>{getInitials(activity.user.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between w-full gap-2">
          <p className="text-sm truncate flex-1">
            <span className="font-medium">{activity.user.name}</span>{" "}
            <span className="text-muted-foreground">
              {t("action." + activity.action)}
            </span>{" "}
            <span className="font-medium">{t("type." + activity.type)}</span>
          </p>
          <Badge variant="outline" className="h-6 shrink-0">
            {getActivityIcon(activity.type)}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(activity.date, {
            addSuffix: true,
            locale: locale === "en" ? enUS : fr,
          })}
        </p>
      </div>
    </div>
  );
};

const TeamActivity = ({
  limit,
  compact = false,
  showHeader = true,
}: TeamActivityProps) => {
  const { team } = useTeam();
  const t = useTranslations("team.overview.activity");

  const activitiesToShow = limit
    ? team.activity.slice(0, limit)
    : team.activity;

  return (
    <Card className={compact ? "border-0 shadow-none" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">{t("title")}</h3>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {activitiesToShow.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
          {/* {limit && mockActivities.length > limit && (
            <Button variant="ghost" className="w-full mt-4" size="sm">
              {t("viewAll")}
            </Button>
          )} */}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamActivity;
