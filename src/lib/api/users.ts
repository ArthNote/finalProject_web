import { consts } from "../constants";
import { encryptData } from "../crypto";

interface accountResponse {
  success: boolean;
  message: string;
}

export async function deleteAccount(id: string): Promise<accountResponse> {
  const response = await fetch(`${consts.backend}/users/account/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete account: ${response.statusText}`);
  }

  return response.json();
}

export async function linkCredentials(data: {
  username: string;
  password: string;
}) {
  const encryptedData = encryptData(data);
  const response = await fetch(`${consts.backend}/users/account`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ encryptedData }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update user password: ${response.statusText}`);
  }

  return response.json();
}

export async function updateLanguage(language: string) {
  const response = await fetch(
    `${consts.backend}/users/language?lang=${language}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to update user Language: ${response.statusText}`);
  }

  return response.json();
}
