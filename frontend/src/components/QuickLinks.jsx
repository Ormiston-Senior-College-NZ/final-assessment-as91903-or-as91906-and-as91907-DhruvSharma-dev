import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStoredQuickLinks, loadStoredQuickLinks } from "../data/studentNetData";

// Shared style for internal and external quick link buttons.
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
  // Load saved quick links so teachers can edit them from the panel.
  const [quickLinks, setQuickLinks] = useState(() => getStoredQuickLinks());

  useEffect(() => {
    loadStoredQuickLinks().then(setQuickLinks);
  }, []);

  return (
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

          {quickLinks.map((quickLink) =>
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
