import { consts } from "../constants";

export async function sendEmail(data: {
  name: string;
  email: string;
  message: string;
}): Promise<{
  message: string;
  success: boolean;
  error?: string;
}> {
  const response = await fetch(`${consts.backend}/contact`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create contact email");
  }

  return response.json();
}
