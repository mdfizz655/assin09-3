import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8">{children}</main>
      <Footer />
    </div>
  );
}
