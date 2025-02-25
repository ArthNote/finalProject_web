import "@/app/globals.css";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import BreadcrumbNavigation from "@/components/breadcrumb_navigation";
import { MySidebar } from "@/components/sidebar/mysidebar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <MySidebar />
      <main className="w-full">
        <div className="w-full p-2 space-x-2 border border-b  border-l-0 flex items-center fixed z-10 bg-background/60 backdrop-blur-xl transition-all">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <BreadcrumbNavigation />
        </div>
        <section className="p-4 pt-2 mt-14">{children}</section>
      </main>
    </SidebarProvider>
  );
}
