import { Message } from "./chat";

export interface CreateMessageData {
  content: string;
  type: "text" | "file" | "image";
  fileName?: string;
  fileSize?: number;
}

export interface CreateMessageResponse {
  message: string;
  success: boolean;
  data: Message;
}

export interface GetMessagesResponse {
  message: string;
  success: boolean;
  data: {
    messages: Message[];
    hasMore: boolean;
    nextCursor?: string;
  };
}

export interface GetMessagesParams {
  chatId: string;
  cursor?: string;
  limit?: number;
}
