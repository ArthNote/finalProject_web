import type { Metadata } from "next";
import "@/app/globals.css";
import { Providers } from "@/components/wrappers/wrappers";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import {
  geistSans,
  playfair,
  crimsonPro,
  spaceGrotesk,
  exo,
  firaCode,
  dmMono,
} from "@/lib/fonts";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "TaskFlow",
  description:
    "TaskFlow is a task management app. It helps you organize your tasks and get things done.",
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className="prevent-scroll-shift"
    >
      <body
        className={cn(
          geistSans.variable,
          playfair.variable,
          crimsonPro.variable,
          spaceGrotesk.variable,
          exo.variable,
          firaCode.variable,
          dmMono.variable,
          "antialiased font-geist"
        )}
        suppressHydrationWarning
      >
        <Providers messages={messages} locale={locale}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
