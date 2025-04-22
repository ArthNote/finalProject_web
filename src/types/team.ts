import { TaskType } from "./task";

export type TeamRole = "owner" | "admin" | "member";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  avatar?: string;
}

export interface teamActivity {
  id: string;
  user: {
    name: string;
    avatar: string | null;
  };
  type: "task" | "member" | "resource" | "team";
  action: string;
  date: Date;
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
  activity: teamActivity[];
  tasks: TaskType[];
  resources: TeamResource[];
}

export interface TeamDetailsResponse {
  message: string;
  success: boolean;
  data: TeamDetails;
}

export interface createResourceResponse {
  message: string;
  success: boolean;
}

export interface createResourceRequest {
  name: string;
  type: "file" | "link";
  url?: string;
  fileData?: any;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
}
export interface TeamResource {
  id: string;
  name: string;
  type: "file" | "link";
  url: string;
  size?: number;
  uploadedBy: string;
  createdAt: Date;
}
