"use client";

import { ThemeProvider } from "./theme_provider";
import { Toaster } from "@/components/ui/toaster";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { FontProvider } from "./font-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
interface ProvidersProps {
  children: React.ReactNode;
  // messages: AbstractIntlMessages;
  // locale: string;
}

export function Providers({ children }: ProvidersProps) {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <FontProvider>
            {children}
            <Toaster />
          </FontProvider>
        </ThemeProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </>
  );
}
