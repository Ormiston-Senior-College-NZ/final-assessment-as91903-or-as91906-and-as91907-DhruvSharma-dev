// Fixed shortcut bar shown by Layout. It renders internal routes with React Router
// and external destinations with normal anchors, while loading teacher-edited link
// data from SQLite and retaining local defaults if Flask is temporarily unavailable.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStoredQuickLinks, loadStoredQuickLinks } from "../data/studentNetData";

// Both Link and anchor elements use this style so every shortcut looks the same.
const quickLinkClass = `
  flex
  min-h-10
  min-w-[8.5rem]
  shrink-0
  items-center
  justify-center
  rounded-md
  border
  border-[#C49A00]
  bg-white
  px-3
  text-xs
  font-medium
  transition
  hover:bg-gray-50
  sm:min-w-44
  sm:min-h-11
  sm:flex-1
  sm:px-5
  sm:text-sm
`;

export default function QuickLinks() {
  // Show the browser copy immediately, then check for newer database content.
  const [quickLinks, setQuickLinks] = useState(() => getStoredQuickLinks());

  useEffect(() => {
    // The empty dependency array means this database request runs once on load.
    loadStoredQuickLinks().then(setQuickLinks);
  }, []);

  return (
    // The outer container fixes the links near the bottom of every main page.
    <div className="fixed bottom-2 left-0 right-0 z-50 px-2 sm:bottom-4 sm:px-6">
      <div
        className="
          relative
          mx-auto
          max-w-488
          bg-white
          rounded-xl
          shadow-[0_-18px_45px_rgba(0,0,0,0.45)]
          border
          border-[#C49A00]
          px-2
          py-2
          sm:px-4
          sm:py-3
        "
      >
        <div className="flex flex-nowrap justify-start gap-1.5 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:gap-2 sm:overflow-visible sm:pb-0">

          {/* Phones can scroll the row sideways, while larger screens wrap links. */}
          {quickLinks.map((quickLink) =>
            // Internal links use React Router and external links open a new tab.
            quickLink.isInternal ? (
              <Link
                key={quickLink.id}
                to={quickLink.url}
                className={quickLinkClass}
              >
                {quickLink.label}
              </Link>
            ) : (
              <a
                key={quickLink.id}
                href={quickLink.url}
                target="_blank"
                // Prevent the new website from controlling the original tab.
                rel="noopener noreferrer"
                className={quickLinkClass}
              >
                {quickLink.label}
              </a>
            ),
          )}

        </div>
      </div>
    </div>
  );
}
