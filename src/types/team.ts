export type TeamRole = "owner" | "admin" | "member";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  avatar?: string;
}

export interface TeamSubscriptionInfo {
  seats: {
    used: number;
    total: number;
  };
  storage: {
    used: number;
    total: number;
    unit: "GB" | "TB";
  };
  plan: {
    name: string;
    memberLimit: number;
    features: string[];
    status: "active" | "trialing" | "canceled";
    renewalDate: string;
  };
}

export interface TeamDetails {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  plan: {
    name: string;
    memberLimit: number;
    features: string[];
  };
  members: TeamMember[];
  subscription: TeamSubscriptionInfo;
  storage: {
    used: number;
    total: number;
  };
}
