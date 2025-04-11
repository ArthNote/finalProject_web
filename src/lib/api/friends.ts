import { FriendResponse } from "@/types/friend";
import { consts } from "../constants";

export async function getFriends(): Promise<FriendResponse> {
  const response = await fetch(`${consts.backend}/friends`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get friends: ${response.statusText}`);
  }

  return response.json();
}

export async function sendFriendRequest(
  userId: string
): Promise<FriendResponse> {
  const response = await fetch(`${consts.backend}/friends/send-request`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send friend request: ${response.statusText}`);
  }

  return response.json();
}

export async function respondToFriendRequest(data: {
  friendshipId: string;
  action: "accept" | "reject";
}): Promise<FriendResponse> {
  const response = await fetch(`${consts.backend}/friends/respond`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to respond to friend request: ${response.statusText}`
    );
  }

  return response.json();
}

export async function deleteFriendship(
  friendshipId: string
): Promise<FriendResponse> {
  const response = await fetch(`${consts.backend}/friends/delete`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ friendshipId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete friendship: ${response.statusText}`);
  }

  return response.json();
}

export async function getFriendRequests(): Promise<FriendResponse> {
  const response = await fetch(`${consts.backend}/friends/requests`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get friend requests: ${response.statusText}`);
  }

  return response.json();
}

export async function cancelFriendRequest(
  friendshipId: string
): Promise<FriendResponse> {
  const response = await fetch(`${consts.backend}/friends/cancel-request`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ friendshipId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to cancel friend request: ${response.statusText}`);
  }

  return response.json();
}

export async function searchUsers(query: string): Promise<FriendResponse> {
  const response = await fetch(
    `${consts.backend}/friends/search?q=${encodeURIComponent(query)}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to search users: ${response.statusText}`);
  }

  return response.json();
}
