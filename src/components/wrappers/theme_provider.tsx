"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      themes={[
        "light",
        "dark",
        "system",
        "theme-bold-tech",
        "theme-amber-minimal",
        "theme-bubblegum",
        "theme-cyberpunk",
        "theme-twitter",
      ]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
