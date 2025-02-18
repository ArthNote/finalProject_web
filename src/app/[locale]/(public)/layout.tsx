// import Footer from "@/components/wrappers/basic/footer";
import NavBar from "@/components/appbar";

interface VisitorsLayoutProps {
  children: React.ReactNode;
}

export default function VisitorsLayout({ children }: VisitorsLayoutProps) {
  return (
    <>
      <NavBar />
      <main className="flex min-w-screen h-full flex-col pt-[4rem] items-center bg-background justify-between sm:px-24 md:px-32 lg:px-48 xl:px-64">
        <div className="absolute z-[-99] pointer-events-none inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        {children}
      </main>
      {/* <Footer /> */}
    </>
  );
}
