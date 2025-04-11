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

const TeamOverview = () => {
  const { team } = useTeam();

  const seatsPercentage =
    (team.subscription.seats.used / team.subscription.seats.total) * 100;
  const storagePercentage = (team.storage.used / team.storage.total) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardDescription>Current Plan</CardDescription>
              <h3 className="text-2xl font-bold">
                {team.subscription.plan.name}
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {team.subscription.plan.status === "trialing"
                ? "Trial"
                : "Active"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Seats Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Team Seats</span>
              </div>
              <span className="text-muted-foreground">
                {team.subscription.seats.used} of{" "}
                {team.subscription.seats.total} used
              </span>
            </div>
            <Progress value={seatsPercentage} className="h-2" />
          </div>

          {/* Storage Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <span>Storage</span>
              </div>
              <span className="text-muted-foreground">
                {team.storage.used}GB of {team.storage.total}GB used
              </span>
            </div>
            <Progress value={storagePercentage} className="h-2" />
          </div>

          {/* Renewal Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t">
            <CalendarDays className="h-4 w-4" />
            <span>
              Renews on{" "}
              {new Date(
                team.subscription.plan.renewalDate
              ).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamOverview;
