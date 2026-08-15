// Shared shell for student-facing pages. Centralizing Navbar, page spacing and the
// fixed Quick Links bar prevents each page from implementing a slightly different
// layout and reserves enough top/bottom space for fixed-position navigation.
import Navbar from "./Navbar";
import QuickLinks from "./QuickLinks";

export default function Layout({ children }) {
  // Most student pages use this component so shared parts only need to be coded once.
  return (
    <div className="min-h-screen bg-[#404040]">

      {/* Keep the navbar at the top on each main page. */}
      <Navbar />

      {/* Leave space so the fixed bars do not cover the page. */}
      <main className="mx-auto max-w-440 px-3 pt-24 pb-24 sm:px-6 sm:pt-28 sm:pb-52 lg:pt-32 xl:pt-28 xl:pb-40">
        {/* children is replaced by the page currently being viewed. */}
        {children}
      </main>

      {/* Quick links stay at the bottom of the screen. */}
      <QuickLinks />

    </div>
  );
}
