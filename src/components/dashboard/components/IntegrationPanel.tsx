import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";
import {
  CloudCog,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Calendar,
  FileText,
  Mail,
  Settings2,
  Loader2,
} from "lucide-react";

// Types for integrations
interface Integration {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: "connected" | "disconnected" | "error";
  lastSync?: string;
  isActive: boolean;
}

const IntegrationPanel = () => {
  const t = useTranslations("dashboard.integrations");

  // Fetch integrations data
  const {
    data: integrations,
    isLoading,
    isError,
    refetch,
  } = useQuery<Integration[]>({
    queryKey: ["integrations", "status"],
    queryFn: async () => {
      // Replace with actual API call
      return [
        {
          id: "google-calendar",
          name: "Google Calendar",
          icon: <Calendar className="h-4 w-4" />,
          status: "connected",
          lastSync: "2023-04-15T10:30:00Z",
          isActive: true,
        },
        {
          id: "notion",
          name: "Notion",
          icon: <FileText className="h-4 w-4" />,
          status: "connected",
          lastSync: "2023-04-15T09:45:00Z",
          isActive: true,
        },
        {
          id: "gmail",
          name: "Gmail",
          icon: <Mail className="h-4 w-4" />,
          status: "disconnected",
          isActive: false,
        },
      ];
    },
  });

  // Toggle integration
  const toggleIntegration = (id: string) => {
    console.log(`Toggling integration: ${id}`);
    // Implementation would call an API to toggle the integration
  };

  // Format relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));

    if (diffMins < 60) {
      return t("minutesAgo", { minutes: diffMins });
    } else {
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) {
        return t("hoursAgo", { hours: diffHours });
      } else {
        const diffDays = Math.floor(diffHours / 24);
        return t("daysAgo", { days: diffDays });
      }
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge
            variant="outline"
            className="text-emerald-500 border-emerald-200 dark:border-emerald-900/50"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            {t("connected")}
          </Badge>
        );
      case "disconnected":
        return (
          <Badge
            variant="outline"
            className="text-slate-500 border-slate-200 dark:border-slate-800"
          >
            {t("disconnected")}
          </Badge>
        );
      case "error":
        return (
          <Badge
            variant="outline"
            className="text-red-500 border-red-200 dark:border-red-900/50"
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            {t("error")}
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[150px]">
        <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[150px] text-center">
        <AlertCircle className="h-6 w-6 text-red-500 mb-2" />
        <p className="text-sm font-medium">{t("loadError")}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          className="mt-2 text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {integrations?.map((integration) => (
          <div
            key={integration.id}
            className="flex items-center justify-between py-2 border-b last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="bg-accent/50 w-8 h-8 rounded-full flex items-center justify-center">
                {integration.icon}
              </div>
              <div>
                <h4 className="text-sm font-medium">{integration.name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  {getStatusBadge(integration.status)}
                  {integration.lastSync &&
                    integration.status === "connected" && (
                      <span className="text-xs text-muted-foreground">
                        {t("lastSync", {
                          time: getRelativeTime(integration.lastSync),
                        })}
                      </span>
                    )}
                </div>
              </div>
            </div>
            <Switch
              checked={integration.isActive}
              onCheckedChange={() => toggleIntegration(integration.id)}
              disabled={integration.status === "disconnected"}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" size="sm" className="text-xs gap-1">
          <RefreshCw className="h-3.5 w-3.5" />
          {t("syncNow")}
        </Button>

        <Button variant="ghost" size="sm" className="text-xs gap-1">
          <Settings2 className="h-3.5 w-3.5" />
          {t("manageIntegrations")}
        </Button>
      </div>
    </div>
  );
};

export default IntegrationPanel;
