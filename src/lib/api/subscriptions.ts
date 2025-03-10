import { ChangePlanInput, SubscriptionResponse } from "@/types/subscription";
import { consts } from "../constants";
import { encryptData } from "../crypto";

export async function getSubscription(): Promise<SubscriptionResponse> {
  const response = await fetch(`${consts.backend}/subscriptions`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get user subscription: ${response.statusText}`);
  }

  return response.json();
}

export async function changePlan(
  data: ChangePlanInput
): Promise<SubscriptionResponse> {
  const encryptedData = encryptData(data);
  const response = await fetch(`${consts.backend}/subscriptions/plan`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ encryptedData }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to get update subscription: ${response.statusText}`
    );
  }

  return response.json();
}

export async function changeBillingMode(data: {
  mode: "auto" | "manual";
}): Promise<SubscriptionResponse> {
  const encryptedData = encryptData(data);
  const response = await fetch(`${consts.backend}/subscriptions/billingMode`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ encryptedData }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to get update subscription: ${response.statusText}`
    );
  }

  return response.json();
}

export async function cancelSubscription(): Promise<{
  message: string;
  success: boolean;
  link?: string;
}> {
  const response = await fetch(`${consts.backend}/subscriptions/cancel`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to cancel subscription: ${response.statusText}`);
  }

  return response.json();
}
