"use client";

import React, { createContext, useContext, useState } from "react";
import { TeamDetails, TeamMember } from "@/types/team";

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
};

const TeamContext = createContext<{
  team: TeamDetails;
  hasTeamSub: boolean;
  updateTeam: (team: Partial<TeamDetails>) => void;
}>({
  team: mockTeamData,
  hasTeamSub: false,
  updateTeam: () => {},
});

export const TeamProvider = ({ children }: { children: React.ReactNode }) => {
  const [team, setTeam] = useState<TeamDetails>(mockTeamData);
  // Check if team has an active subscription
  const hasTeamSub = true;

  const updateTeam = (updates: Partial<TeamDetails>) => {
    setTeam((prev) => ({ ...prev, ...updates }));
  };

  return (
    <TeamContext.Provider value={{ team, hasTeamSub, updateTeam }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => useContext(TeamContext);
