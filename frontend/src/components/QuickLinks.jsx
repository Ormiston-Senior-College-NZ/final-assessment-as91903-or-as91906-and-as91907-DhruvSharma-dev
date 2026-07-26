import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStoredQuickLinks, loadStoredQuickLinks } from "../data/studentNetData";

const quickLinkClass = `
  flex
  h-11
  min-w-36
  flex-1
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
  sm:px-5
  sm:text-sm
`;

export default function QuickLinks() {
  const [quickLinks, setQuickLinks] = useState(() => getStoredQuickLinks());

  useEffect(() => {
    loadStoredQuickLinks().then(setQuickLinks);
  }, []);

  return (
    <div className="fixed bottom-3 left-0 right-0 z-50 px-3 sm:bottom-4 sm:px-6">
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
          px-3
          py-2
          sm:px-4
          sm:py-3
        "
      >
        <div className="flex flex-wrap justify-center gap-2">

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
