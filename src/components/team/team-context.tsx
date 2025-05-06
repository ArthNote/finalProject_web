"use client";

import React, { createContext, useContext, useState } from "react";
import { TeamDetails, TeamMember } from "@/types/team";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { getSubscription } from "@/lib/api/subscriptions";
import { getTeamData } from "@/lib/api/teams";

const mockTeamData: TeamDetails = {
  id: "1",
  name: "Acme Team",
  description: "Main development team",
  memberCount: 5,
  plan: {
    features: ["Unlimited tasks", "Advanced permissions", "Priority support"],
    memberLimit: 10,
    name: "Team Pro",
  },
  subscription: {
    seats: {
      used: 5,
      total: 10,
    },
    storage: {
      used: 25,
      total: 100,
      unit: "GB",
    },
    plan: {
      name: "Team Pro",
      memberLimit: 10,
      features: ["Unlimited tasks", "Advanced permissions", "Priority support"],
      status: "active",
      renewalDate: "2024-12-31",
    },
  },
  storage: {
    used: 25,
    total: 100,
  },
  members: [
    { id: "1", name: "John Doe", email: "john@example.com", role: "owner" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "admin" },
    {
      id: "3",
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "member",
    },
  ],
  activity: [],
  tasks: [],
  resources: [],
};

const TeamContext = createContext<{
  team: TeamDetails;
  hasTeamSub: boolean;
  updateTeam: (team: Partial<TeamDetails>) => void;
  orgId: string;
}>({
  team: mockTeamData,
  hasTeamSub: false,
  updateTeam: () => {},
  orgId: "",
});

export const TeamProvider = ({ children }: { children: React.ReactNode }) => {
  const [team, setTeam] = useState<TeamDetails>(mockTeamData);

  const {
    data: subscription,
    isLoading: subLoading,
    error: subError,
  } = useQuery({
    queryKey: ["subscription"],
    queryFn: getSubscription,
    refetchOnWindowFocus: true,
  });

  const { data: sessionData, isPending: orgLoading } = authClient.useSession();

  const activeOrgId = sessionData?.user.activeOrganizationId || "";
  const hasTeamSub = subscription?.data?.plan === "team" || false;

  const {
    data: teamData,
    isLoading: teamLoading,
    error: teamError,
  } = useQuery({
    queryKey: ["team", `org-${activeOrgId}`],
    queryFn: hasTeamSub ? getTeamData : () => Promise.resolve(null),
    enabled: hasTeamSub && Boolean(activeOrgId),
    refetchOnWindowFocus: true,
  });

  const updateTeam = (updates: Partial<TeamDetails>) => {
    setTeam((prev) => ({ ...prev, ...updates }));
  };

  // Render based on conditions - after all hooks have been called
  if (subLoading || orgLoading) {
    return <div>Loading...</div>;
  }

  if (!hasTeamSub) {
    return (
      <TeamContext.Provider
        value={{
          team: mockTeamData,
          hasTeamSub: false,
          updateTeam: () => {},
          orgId: "",
        }}
      >
        {children}
      </TeamContext.Provider>
    );
  }

  if (teamLoading) {
    return <div>Loading...</div>;
  }

  if (!teamData) {
    return <div>Error: {teamError?.message || "Failed to load team data"}</div>;
  }

  return (
    <TeamContext.Provider
      value={{
        team: teamData.data,
        hasTeamSub,
        updateTeam,
        orgId: activeOrgId,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => useContext(TeamContext);
