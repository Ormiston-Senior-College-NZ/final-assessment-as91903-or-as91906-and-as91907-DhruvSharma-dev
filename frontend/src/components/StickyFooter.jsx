export default function StickyFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">

      <div className="max-w-7xl mx-auto p-3 flex justify-center gap-4">

        <button className="px-4 py-2 bg-gray-100 rounded-lg">
          Norms
        </button>

        <button className="px-4 py-2 bg-gray-100 rounded-lg">
          Student Portal
        </button>

        <button className="px-4 py-2 bg-gray-100 rounded-lg">
          Wi-Fi Setup
        </button>

        <button className="px-4 py-2 bg-gray-100 rounded-lg">
          School Clubs
        </button>

        <button className="px-4 py-2 bg-gray-100 rounded-lg">
          I-Time Tutorials
        </button>

      </div>

    </footer>
  );
}