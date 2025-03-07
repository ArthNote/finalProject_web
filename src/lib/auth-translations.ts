import { authClient } from "./auth-client";

type ErrorTypes = Partial<
  Record<
    keyof typeof authClient.$ERROR_CODES,
    {
      en: string;
      fr: string;
    }
  >
>;

export const authErrorCodes = {
  INVALID_EMAIL_OR_PASSWORD: {
    en: "Invalid username or password",
    fr: "Nom d'utilisateur ou mot de passe invalide",
  },
  INVALID_PASSWORD: {
    en: "Invalid password",
    fr: "Mot de passe invalide",
  },
  USER_NOT_FOUND: {
    en: "User not found",
    fr: "Utilisateur non trouvé",
  },
  USER_ALREADY_EXISTS: {
    en: "User already exists",
    fr: "L'utilisateur existe déjà",
  },
} satisfies ErrorTypes;

export const getAuthErrorMessage = (
  code: keyof typeof authErrorCodes | string | undefined,
  locale: "en" | "fr"
): string => {
  // Check if code exists and is a valid key in authErrorCodes
  if (code && code in authErrorCodes) {
    return authErrorCodes[code as keyof typeof authErrorCodes][locale];
  }

  // Return default error message if code is invalid or undefined
  return "An unknown error occurred";
};
