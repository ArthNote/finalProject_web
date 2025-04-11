"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquare, CheckCircle2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

interface Activity {
  id: string;
  user: {
    name: string;
    avatar: string | null;
  };
  type: "task" | "comment" | "file";
  action: string;
  target: string;
  date: Date;
  status?: string;
}

interface TeamActivityProps {
  limit?: number;
  compact?: boolean;
  showHeader?: boolean;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    user: { name: "John Doe", avatar: null },
    type: "task",
    action: "completed",
    target: "Update documentation",
    date: new Date(),
    status: "completed",
  },
  {
    id: "2",
    user: { name: "Jane Smith", avatar: "/avatars/jane.png" },
    type: "comment",
    action: "commented on",
    target: "Fix navigation bug",
    date: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "3",
    user: { name: "Alice Johnson", avatar: null },
    type: "file",
    action: "uploaded",
    target: "Design assets.fig",
    date: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
];

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "file":
      return <FileText className="h-4 w-4" />;
    case "comment":
      return <MessageSquare className="h-4 w-4" />;
    case "task":
      return <CheckCircle2 className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const ActivityItem = ({ activity }: { activity: Activity }) => (
  <div className="flex items-center gap-3 py-3 w-full">
    <Avatar className="h-8 w-8 shrink-0">
      <AvatarImage src={activity.user.avatar || ""} />
      <AvatarFallback>{getInitials(activity.user.name)}</AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between w-full gap-2">
        <p className="text-sm truncate flex-1">
          <span className="font-medium">{activity.user.name}</span>{" "}
          <span className="text-muted-foreground">{activity.action}</span>{" "}
          <span className="font-medium truncate">{activity.target}</span>
        </p>
        <Badge variant="outline" className="h-6 shrink-0">
          {getActivityIcon(activity.type)}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        {formatDistanceToNow(activity.date, { addSuffix: true })}
      </p>
    </div>
  </div>
);

const TeamActivity = ({
  limit,
  compact = false,
  showHeader = true,
}: TeamActivityProps) => {
  const activities = limit ? mockActivities.slice(0, limit) : mockActivities;

  return (
    <Card className={compact ? "border-0 shadow-none" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">Latest updates</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
          {limit && mockActivities.length > limit && (
            <Button variant="ghost" className="w-full mt-4" size="sm">
              View all activity
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamActivity;
