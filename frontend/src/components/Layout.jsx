import Navbar from "./Navbar";
import StickyFooter from "./StickyFooter";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-400">
      <Navbar />

      <main className="pb-24">
        {children}
      </main>

      <StickyFooter />
    </div>
  );
}