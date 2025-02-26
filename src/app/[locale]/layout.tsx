import type { Metadata } from "next";
import "@/app/globals.css";
import "@/styles/animations.css"; // Add this line
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
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "fr" | "en")) {
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
          "antialiased font-geist relative overflow-x-hidden min-h-screen bg-background"
        )}
        suppressHydrationWarning
      >
        <div className="fixed inset-0 -z-10">
          {/* Base background */}
          <div className="absolute inset-0 bg-[#fafafa] dark:bg-[#0a0a0a] opacity-90" />

          {/* Grid pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] animate-[grid-fade_4s_ease-in-out_infinite]" />
            <div className="absolute inset-0 bg-[radial-gradient(#80808010_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent)] animate-[noise_8s_infinite]" />
          </div>

          {/* Noise overlay with animation */}
          <div className="absolute inset-0 [background:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-20 animate-[noise_3s_steps(4,end)_infinite]" />

          {/* Gradient accents */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tl from-secondary/10 to-transparent rounded-full blur-3xl" />
          </div>

          {/* Light rays */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100%,#ffffff05,transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200%,#00000005,transparent)]" />

          {/* Final overlay */}
          <div className="absolute inset-0 backdrop-blur-[1px] backdrop-saturate-150" />
        </div>
        <Providers messages={messages} locale={locale}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
