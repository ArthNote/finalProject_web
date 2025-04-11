"use client";

import { useTeam } from "../team-context";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";

interface TeamMembersListProps {
  limit?: number;
  compact?: boolean;
  showRole?: boolean;
}

const TeamMembersList = ({
  limit,
  compact = false,
  showRole = true,
}: TeamMembersListProps) => {
  const { team } = useTeam();

  const members = limit ? team.members.slice(0, limit) : team.members;
  const hasMore = limit && team.members.length > limit;

  return (
    <Card className={compact ? "border-0 shadow-none" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <h3 className="font-medium">Team Members</h3>
          <p className="text-sm text-muted-foreground">
            {team.memberCount} members
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between space-x-4"
          >
            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">
                  {member.name}
                </p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
            </div>
            {showRole && (
              <Badge
                variant={member.role === "owner" ? "default" : "secondary"}
                className="capitalize"
              >
                {member.role}
              </Badge>
            )}
          </div>
        ))}
        {hasMore && (
          <div className="text-sm text-muted-foreground text-center pt-2">
            +{team.memberCount - limit!} more members
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamMembersList;
