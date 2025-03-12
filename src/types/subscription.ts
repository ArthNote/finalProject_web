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

export interface Invoice {
  id: string;
  amount: number;
  paid: boolean;
  invoicePdf?: string;
  invoiceUrl?: string;
  created: Date;
}

export interface InvoicesResponse {
  success: boolean;
  data?: Invoice[];
  message: string;
}

export interface Card {
  id: string;
  brand: string;
  last4: string;
  month: number;
  year: number;
}

export interface CardResponse {
  success: boolean;
  data?: Card;
  message: string;
}

export interface FinalizeInvoiceResponse {
  success: boolean;
  data?: string;
  message: string;
}
