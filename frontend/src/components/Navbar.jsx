import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/osc-logo.png";

// Shared styling for each navbar link, including the active page state.
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

// Simple keyword map that sends searches to the most likely page.
// More specific pages are near the top so they win before broader words.
const searchRoutes = [
  {
    path: "/careers",
    keywords: ["career", "careers", "gateway", "university", "apprenticeship"],
  },
  {
    path: "/curriculum",
    keywords: ["curriculum", "subject", "subjects", "ncea", "level", "pathway", "scholarship", "scholarships"],
  },
  {
    path: "/student-info",
    keywords: ["student", "gpa", "rank", "score", "sports", "leadership", "doe"],
  },
  {
    path: "/web-apps",
    keywords: ["web", "apps", "gmail", "classroom", "refseek", "myportfolio"],
  },
  {
    path: "/norms",
    keywords: ["norm", "norms", "attendance", "uniform", "behaviour", "devices", "exams"],
  },
  {
    path: "/",
    keywords: ["announcement", "announcements", "map", "calendar", "event", "week"],
  },
];

const navItems = [
  { path: "/", label: "Home" },
  { path: "/student-info", label: "Student Info" },
  { path: "/web-apps", label: "Web-Based App(s)" },
  { path: "/careers", label: "Careers" },
  { path: "/curriculum", label: "Curriculum" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  function handleSearchSubmit(event) {
    // When Enter is pressed, choose a page and pass the search word as a highlight.
    event.preventDefault();

    const trimmedSearchTerm = searchTerm.trim().toLowerCase();

    if (!trimmedSearchTerm) {
      return;
    }

    const matchingRoute =
      searchRoutes.find((route) =>
        // If the search text contains any keyword, that page is chosen.
        route.keywords.some((keyword) => trimmedSearchTerm.includes(keyword)),
      ) || searchRoutes[0];

    // The highlight query lets the destination page mark matching words.
    navigate(`${matchingRoute.path}?highlight=${encodeURIComponent(trimmedSearchTerm)}`);
    setSearchTerm("");
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
        {/* Mobile top row: logo, search icon, and hamburger menu. */}
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

        {/* Desktop navigation stays visible across the top. */}
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

        {/* Desktop search stays visible, while mobile uses the search icon. */}
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
