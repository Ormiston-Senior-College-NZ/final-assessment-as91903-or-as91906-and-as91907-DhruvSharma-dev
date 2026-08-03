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

export default function Navbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

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
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Ormiston Senior College StudentNET Logo"
            className="h-8 w-auto object-contain sm:h-10 lg:h-12"
          />
        </div>

        {/* Navigation */}
        <div className="order-3 flex w-full items-center gap-2 overflow-x-auto pb-1 sm:gap-3 lg:order-0 lg:w-auto lg:flex-1 lg:justify-center xl:gap-4 xl:overflow-visible xl:pb-0">
          <NavLink
            to="/"
            className={navLinkClass}
          >
            Home
          </NavLink>

          <NavLink
            to="/student-info"
            className={navLinkClass}
          >
            Student Info
          </NavLink>

          <NavLink
            to="/web-apps"
            className={navLinkClass}
          >
            Web-Based App(s)
          </NavLink>

          <NavLink
            to="/careers"
            className={navLinkClass}
          >
            Careers
          </NavLink>

          <NavLink
            to="/curriculum"
            className={navLinkClass}
          >
            Curriculum
          </NavLink>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearchSubmit}
          className="min-w-0 flex-1 sm:flex-none"
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
      </nav>
    </div>
  );
}
