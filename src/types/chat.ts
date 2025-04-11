export interface User {
  id: string;
  username: string;
  email: string;
  image?: string;
}

export interface ChatParticipant {
  userId: string;
  role: "admin" | "member";
  user: User;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  sender: User;
  createdAt: string;
  status: "sent" | "delivered" | "read";
  type: "text" | "file" | "image";
  fileName?: string;
  fileSize?: number;
}

export interface Chat {
  id: string;
  type: "individual" | "group";
  name?: string;
  participants: ChatParticipant[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatResponse {
  message: string;
  success: boolean;
  data: Chat;
}

export interface ChatListResponse {
  message: string;
  success: boolean;
  data: Chat[];
}

export type SingleChatResponse = ChatResponse;

export interface UpdateChatMembersData {
  addMembers?: string[];
  removeMembers?: string[];
  roleUpdates?: { userId: string; role: "admin" | "member" }[];
}
