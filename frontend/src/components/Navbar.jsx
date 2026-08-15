// Responsive global navigation and site-wide search. Search combines fixed page
// keywords with teacher-edited cached content, chooses the most relevant route, and
// passes the query in the URL so destination pages can highlight matching content.
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/osc-logo.png";
import {
  getStoredAnnouncements,
  getStoredCareersSupport,
  getStoredNorms,
  getStoredQuickLinks,
  getStoredStudentInfoLinks,
  getStoredSubjects,
  getStoredWebAppLinks,
  getStoredWeekItems,
} from "../data/studentNetData";
import { findBestSearchRoute } from "../utils/siteSearch";

// Give every navbar link the same style.
const navLinkClass = ({ isActive }) =>
  `
    rounded-lg
    px-3
    py-1.5
    text-sm
    sm:text-base
    md:px-3
    md:py-2
    xl:px-4
    xl:py-2.5
    xl:text-lg
    font-semibold
    whitespace-nowrap
    transition
    duration-200
    ${
      isActive
        ? "bg-[#F2901D] text-white shadow-sm"
        : "text-gray-800 hover:bg-[#fff5e9] hover:text-[#F2901D]"
    }
  `;

function searchableValues(items, fields) {
  // Turn saved website content into one string that can be searched.
  // flatMap checks every requested field on every item. Missing fields use an
  // empty string so incomplete teacher content cannot break the search.
  return items.flatMap((item) => fields.map((field) => item[field] || "")).join(" ");
}

function getSearchRoutes() {
  // Each page has keywords and its real saved content to search through.
  // It runs on submit, so it reads the newest content in local storage.
  const subjects = Object.values(getStoredSubjects()).flat();
  const careersSupport = getStoredCareersSupport();

  return [
    // Keywords describe common searches. Content contains the actual editable
    // text, so new teacher-created items become searchable automatically.
    {
      path: "/careers",
      keywords: ["career", "careers", "gateway", "university", "apprenticeship", "advisor", "pathways"],
      content: `${careersSupport.title} ${careersSupport.message} Andrea Daly Linda Scott Andrew Johnson Umani Ganegama`,
    },
    {
      path: "/curriculum",
      keywords: ["curriculum", "subject", "subjects", "ncea", "level", "pathway", "scholarship"],
      content: searchableValues(subjects, ["name", "description", "pathway"]),
    },
    {
      path: "/student-info",
      keywords: ["student info", "gpa", "rank score", "credits", "grades", "sports", "leadership", "doe"],
      content: searchableValues(getStoredStudentInfoLinks(), ["label"]),
    },
    {
      path: "/web-apps",
      keywords: ["web apps", "learning tools", "school websites", "gmail", "classroom", "refseek", "myportfolio"],
      content: searchableValues(getStoredWebAppLinks(), ["label"]),
    },
    {
      path: "/expectations",
      keywords: ["expectation", "expectations", "norm", "norms", "rules", "attendance", "uniform", "behaviour", "devices"],
      content: searchableValues(getStoredNorms(), ["title", "category", "content"]),
    },
    {
      path: "/",
      keywords: ["home", "announcement", "map", "calendar", "event", "week", "quick links"],
      content: [
        searchableValues(getStoredWeekItems(), ["day", "title", "time", "location"]),
        searchableValues(getStoredAnnouncements(), ["title", "message", "date"]),
        searchableValues(getStoredQuickLinks(), ["label"]),
      ].join(" "),
    },
  ];
}

const navItems = [
  // This one array is reused for both the desktop and mobile navigation menus.
  { path: "/", label: "Home" },
  { path: "/student-info", label: "Student Info" },
  { path: "/web-apps", label: "Web-Based App(s)" },
  { path: "/careers", label: "Careers" },
  { path: "/curriculum", label: "Curriculum" },
];

export default function Navbar() {
  // useNavigate changes routes without refreshing the whole React application.
  const navigate = useNavigate();
  // Desktop and mobile search inputs share this value.
  const [searchTerm, setSearchTerm] = useState("");
  // These values control which mobile panel is currently visible.
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  function handleSearchSubmit(event) {
    // Pressing Enter finds the page that matches best.
    event.preventDefault();

    const trimmedSearchTerm = searchTerm.trim().toLowerCase();

    if (!trimmedSearchTerm) {
      // Do nothing if the user submits only spaces or an empty input.
      return;
    }

    // This checks full words, page content and small spelling mistakes.
    const matchingRoute = findBestSearchRoute(trimmedSearchTerm, getSearchRoutes());
    // If nothing matches, Home is used as a safe general fallback.
    const destinationPath = matchingRoute?.path || "/";

    // Put the search in the URL so the next page can highlight it.
    navigate(`${destinationPath}?highlight=${encodeURIComponent(trimmedSearchTerm)}`);
    setSearchTerm("");
    // Close mobile panels after navigating so they do not cover the result.
    setIsSearchOpen(false);
    setIsMenuOpen(false);
  }

  return (
    <div className="fixed left-0 right-0 top-2 z-50 px-2 sm:top-3 sm:px-6">
      <nav
        className="
          relative
          mx-auto
          max-w-488
          bg-white
          rounded-xl
          shadow-[0_18px_45px_rgba(0,0,0,0.45)]
          min-h-16
          px-3
          py-2
          sm:px-4
          sm:py-3
          lg:px-6
          flex
          flex-wrap
          items-center
          justify-between
          gap-3
          xl:flex-nowrap
          xl:gap-6
        "
      >
        {/* On mobile these buttons open the search and menu. */}
        <div className="flex w-full items-center justify-between gap-3 lg:w-auto">
          <img
            src={logo}
            alt="Ormiston Senior College StudentNET Logo"
            className="h-8 w-auto object-contain sm:h-10 lg:h-12"
          />

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen((currentValue) => !currentValue);
                setIsMenuOpen(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#F2901D] text-gray-900 transition hover:bg-[#fff8ec]"
              aria-label="Open search"
              aria-expanded={isSearchOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMenuOpen((currentValue) => !currentValue);
                setIsSearchOpen(false);
              }}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-lg border border-[#F2901D] transition hover:bg-[#fff8ec]"
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
            >
              <span className="h-0.5 w-5 rounded-full bg-gray-900" />
              <span className="h-0.5 w-5 rounded-full bg-gray-900" />
              <span className="h-0.5 w-5 rounded-full bg-gray-900" />
            </button>
          </div>
        </div>

        {/* The full menu is shown on larger screens. */}
        <div className="hidden items-center gap-3 lg:flex lg:flex-1 lg:justify-center xl:gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={navLinkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop has enough room to always show the search bar. */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden lg:block"
        >
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search..."
            className="
              w-full
              sm:w-56
              border
              border-gray-300
              rounded-lg
              px-3
              py-2.5
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-[#F2901D]
              focus:border-[#F2901D]
            "
          />
        </form>

        {isSearchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className="w-full lg:hidden"
          >
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search..."
              autoFocus
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                px-3
                py-3
                text-sm
                focus:border-[#F2901D]
                focus:outline-none
                focus:ring-2
                focus:ring-[#F2901D]
              "
            />
          </form>
        )}

        {isMenuOpen && (
          <div className="grid w-full grid-cols-1 gap-2 lg:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={navLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
}
