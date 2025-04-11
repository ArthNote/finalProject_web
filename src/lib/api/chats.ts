import {
  Chat,
  ChatResponse,
  SingleChatResponse,
  ChatListResponse,
} from "@/types/chat";
import { consts } from "../constants";
import { CreateMessageData, CreateMessageResponse } from "@/types/message";

export async function createChat(data: {
  participantIds: string[];
  type: "individual" | "group";
  name?: string;
}): Promise<ChatResponse> {
  const response = await fetch(`${consts.backend}/chats`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create chat");
  }

  return response.json();
}

export async function getChats(): Promise<ChatListResponse> {
  const response = await fetch(`${consts.backend}/chats`, {
    credentials: "include",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch chats");
  }

  return response.json();
}

export async function getChatById(chatId: string): Promise<SingleChatResponse> {
  const response = await fetch(`${consts.backend}/chats/${chatId}`, {
    credentials: "include",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch chat");
  }

  return response.json();
}

export async function updateChat(
  chatId: string,
  data: { name: string }
): Promise<SingleChatResponse> {
  const response = await fetch(`${consts.backend}/chats/${chatId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update chat");
  }

  return response.json();
}

export interface GroupFormData {
  name: string;
  participantIds: string[];
}

export interface UpdateChatMembersData {
  addMembers?: string[];
  removeMembers?: string[];
  roleUpdates?: { userId: string; role: "admin" | "member" }[];
}

export async function updateChatMembers(
  chatId: string,
  data: UpdateChatMembersData
): Promise<SingleChatResponse> {
  const response = await fetch(`${consts.backend}/chats/${chatId}/members`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update chat members");
  }

  return response.json();
}

export async function deleteChat(chatId: string) {
  const response = await fetch(`${consts.backend}/chats/${chatId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete chat");
  }

  return response.json();
}

export async function sendMessage(chatId: string, data: CreateMessageData): Promise<CreateMessageResponse> {
  const response = await fetch(`${consts.backend}/messages/${chatId}`, {
    method: "POST",
    credentials: "include", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }

  return response.json();
}
