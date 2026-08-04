import Navbar from "./Navbar";
import QuickLinks from "./QuickLinks";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#404040]">

      {/* Fixed top navigation shared by normal pages. */}
      <Navbar />

      {/* Page content sits between the fixed navbar and quick links bar. */}
      <main className="mx-auto max-w-440 px-3 pt-24 pb-24 sm:px-6 sm:pt-28 sm:pb-52 lg:pt-32 xl:pt-28 xl:pb-40">
        {children}
      </main>

      {/* Fixed bottom shortcuts shared by normal pages. */}
      <QuickLinks />

    </div>
  );
}
