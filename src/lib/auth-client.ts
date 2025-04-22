import { createAuthClient } from "better-auth/react";
import {
  usernameClient,
  twoFactorClient,
  inferAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { stripeClient } from "@better-auth/stripe/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL!,
  plugins: [
    usernameClient(),
    twoFactorClient(),
    stripeClient({
      subscription: true,
    }),
    inferAdditionalFields({
      user: {
        lang: {
          type: "string",
        },
      },
    }),
    organizationClient({
      teams: {
        enabled: true,
      },
    }),
  ],
});

export type Session = typeof authClient.$Infer.Session;
