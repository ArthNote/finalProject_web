import { CreateMessageData, CreateMessageResponse, GetMessagesResponse } from "@/types/message";
import { consts } from "../constants";

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

export async function getMessages(
  chatId: string,
  cursor?: string,
  limit: number = 50
): Promise<GetMessagesResponse> {
  const url = new URL(`${consts.backend}/messages/${chatId}`);
  if (cursor) url.searchParams.append("cursor", cursor);
  url.searchParams.append("limit", limit.toString());

  const response = await fetch(url.toString(), {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to get messages: ${response.statusText}`);
  }

  return response.json();
}
