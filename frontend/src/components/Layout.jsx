import Navbar from "./Navbar";
import QuickLinks from "./QuickLinks";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#404040]">

      <Navbar />

      <main className="mx-auto max-w-440 px-3 pt-40 pb-52 sm:px-6 xl:pt-28 xl:pb-40">
        {children}
      </main>

      <QuickLinks />

    </div>
  );
}
