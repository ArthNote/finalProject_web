import { Message } from "./chat";

export interface CreateMessageData {
  content: string;
  type: "text" | "file" | "image";
  fileName?: string;
  fileSize?: number;
  fileData?: string; // Add this property for base64 file data
  replyToId?: string; // Add this field to support replies
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

export interface SearchMessagesResponse {
  message: string;
  success: boolean;
  data: Message[];
}
