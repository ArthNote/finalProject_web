import NavBar from "@/components/appbar";
import Footer from "@/components/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 flex pt-[4rem] md:px-16 lg:px-24 xl:px-36 2xl:px-64 px-6 flex-col justify-center items-center">
        {children}
      </main>
      {/* <main className="flex min-w-screen h-full flex-col pt-[4rem] items-center bg-background justify-between md:px-16 lg:px-24 xl:px-36 2xl:px-64 px-6">
        <div className="absolute z-[-99] pointer-events-none inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        {children}
      </main> */}
      <Footer />
    </div>
  );
}
