import Navbar from "./Navbar";
import QuickLinks from "./QuickLinks";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#404040]">

      <Navbar />

      <main className="mx-auto max-w-[110rem] px-6 pt-28 pb-40">
        {children}
      </main>

      <QuickLinks />

    </div>
  );
}
