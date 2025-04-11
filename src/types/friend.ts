import { User } from "./chat";

export interface Friend {
  id: string;
  status: string;
  sender: User;
  receiver: User;
  createdAt: string;
  updatedAt: string;
}

export interface SearchUserResult {
  id: string;
  username: string;
  email: string;
  image?: string;
}

export interface FriendResponse {
  message: string;
  success: boolean;
  data: Friend[] | SearchUserResult[];
}
