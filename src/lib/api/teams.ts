import {
  createResourceRequest,
  createResourceResponse,
  TeamDetailsResponse,
} from "@/types/team";
import { consts } from "../constants";

export async function getTeamData(): Promise<TeamDetailsResponse> {
  const response = await fetch(`${consts.backend}/teams`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get team: ${response.statusText}`);
  }

  return response.json();
}

export async function createResource(
  data: createResourceRequest
): Promise<createResourceResponse> {
  const response = await fetch(`${consts.backend}/teams/resource`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create resource: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteResource(
  id: string
): Promise<createResourceResponse> {
  const response = await fetch(`${consts.backend}/teams/resource/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete resource: ${response.statusText}`);
  }

  return response.json();
}
