export interface Subscription {
  id: string;
  plan: string;
  referenceId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status?: string;
  periodStart?: Date;
  periodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  seats?: number;
  trialStart?: Date;
  trialEnd?: Date;
  billing?: string;
  price?: number;
  autoRenew?: boolean;
}
export interface SubscriptionResponse {
  success: boolean;
  data?: Subscription;
  message: string;
}

export interface ChangePlanInput {
  subscriptionId: string;
  billing: string;
  price: number;
}
