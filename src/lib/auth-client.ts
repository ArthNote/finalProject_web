import { createAuthClient } from "better-auth/react";
import {
  usernameClient,
  twoFactorClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { stripeClient } from "@better-auth/stripe/client";

export const authClient = createAuthClient({
  baseURL: process.env.BACKEND_URL || "http://localhost:8080",

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
  ],
});

export type Session = typeof authClient.$Infer.Session;
