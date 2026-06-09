import Navbar from "./Navbar";
import QuickLinks from "./QuickLinks";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#404040]">

      <Navbar />

      <main className="max-w-375 mx-auto px-6 pt-24 pb-24">
        {children}
      </main>

      <QuickLinks />

    </div>
  );
}