import {
  CreateMessageData,
  CreateMessageResponse,
  GetMessagesResponse,
  SearchMessagesResponse,
} from "@/types/message";
import { consts } from "../constants";

export async function sendMessage(
  chatId: string,
  data: CreateMessageData
): Promise<CreateMessageResponse> {
  console.log("Sending message API call:", {
    chatId,
    type: data.type,
    hasFileData: !!data.fileData,
    fileName: data.fileName,
    fileSize: data.fileSize,
  });

  try {
    const response = await fetch(`${consts.backend}/messages/${chatId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error("API error response:", {
        status: response.status,
        statusText: response.statusText,
      });
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Message API response:", result);
    return result;
  } catch (error) {
    console.error("Send message API error:", error);
    throw error;
  }
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

export async function searchMessages(
  chatId: string,
  query: string
): Promise<SearchMessagesResponse> {
  const url = new URL(`${consts.backend}/messages/${chatId}/search`);
  url.searchParams.append("q", query);

  const response = await fetch(url.toString(), {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to search messages: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteMessage(
  messageId: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${consts.backend}/messages/${messageId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete message: ${response.statusText}`);
  }

  return response.json();
}
