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
      <main className="flex-1 flex my-18 sm:mb-18 sm:mt-28">{children}</main>
      <Footer />
    </div>
  );
}
