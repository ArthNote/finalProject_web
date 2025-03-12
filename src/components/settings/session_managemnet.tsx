import { useToast } from "@/hooks/use-toast";
import { useLocale, useTranslations } from "next-intl";
import React, { useTransition } from "react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SessionsSkeleton } from "./account-skeletons";

// Function to parse user agent string
const parseUserAgent = (userAgent: string, locale: string) => {
  let os = "Unknown OS";
  let browser = "Unknown Browser";

  // OS detection
  if (userAgent.includes("Windows")) {
    os = "Windows";
  } else if (userAgent.includes("Mac OS")) {
    os = "macOS";
  } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    os = "iOS";
  } else if (userAgent.includes("Android")) {
    os = "Android";
  } else if (userAgent.includes("Linux")) {
    os = "Linux";
  }

  // Browser detection
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    browser = "Chrome";
  } else if (userAgent.includes("Firefox")) {
    browser = "Firefox";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browser = "Safari";
  } else if (userAgent.includes("Edg")) {
    browser = "Edge";
  }

  // Default location - in a real app, this would come from IP geolocation
  const location = locale === "en" ? "Unknown Location" : "Emplacement inconnu";

  return `${os} • ${browser} • ${location}`;
};

const SessionManagement = () => {
  const { toast } = useToast();
  const t = useTranslations("settings.account");
  const { data: currentSession, isPending: sessionPending } =
    authClient.useSession();
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const locale = useLocale() as "en" | "fr";

  const { data, isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      return authClient.listSessions();
    },
  });

  // Show skeleton if either session or sessions data is loading

  // Sort sessions to put current session at the top
  const sortedSessions = React.useMemo(() => {
    if (!data?.data) return [];

    return [...data.data].sort((a, b) => {
      if (a.id === currentSession?.session.id) return -1;
      if (b.id === currentSession?.session.id) return 1;
      return 0;
    });
  }, [data?.data, currentSession?.session.id]);

  if (sessionPending || isLoading) {
    return <SessionsSkeleton />;
  }

  function handleLogout(sessionToken: string) {
    startTransition(async () => {
      const { error } = await authClient.revokeSession({
        token: sessionToken,
      });

      if (error) {
        toast({
          title: t("sessions.logoutError"),
          description:
            t("sessions.logoutErrorDescription") + " " + error.message,
        });
        return;
      }

      toast({
        title: t("sessions.logoutSuccess"),
        description: t("sessions.logoutSuccessDescription"),
      });

      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-1">{t("sessions.title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("sessions.description")}
        </p>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          // Skeleton loaders while data is loading
          <>
            <SessionsSkeleton />
            <SessionsSkeleton />
          </>
        ) : (
          // Use the sorted sessions array instead of data?.data
          sortedSessions.map((session) => (
            <div
              className="flex justify-between items-center p-4 rounded-lg border"
              key={session.id}
            >
              <div>
                <p className="text-sm font-medium">
                  {session.id === currentSession?.session.id
                    ? t("sessions.device.current")
                    : t("sessions.device.other")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {parseUserAgent(session.userAgent || "", locale)}
                </p>
              </div>
              {session.id === currentSession?.session.id ? (
                <Button variant="secondary" size="sm" disabled>
                  {t("sessions.current")}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleLogout(session.token)}
                >
                  {isPending ? (
                    <>
                      <div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      {t("sessions.revoking")}
                    </>
                  ) : (
                    t("sessions.revoke")
                  )}
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SessionManagement;
