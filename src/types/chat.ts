export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
}

export interface Chat {
  id: string;
  name: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
    status?: "online" | "offline" | "away";
  }[];
  lastMessage?: Message;
  unreadCount?: number;
}
