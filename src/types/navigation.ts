import { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  type: string;
  items?: {
    title: string;
    url: string;
  }[];
};
